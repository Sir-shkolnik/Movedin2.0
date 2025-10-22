"""
Simple In-Memory Cache Service
No external dependencies (Redis), just Python dict with TTL
Perfect for <10K records and moderate traffic
"""

import logging
from datetime import datetime, timedelta
from typing import Any, Optional, Dict
from threading import Lock

logger = logging.getLogger(__name__)


class SimpleCache:
    """
    Thread-safe in-memory cache with TTL (Time To Live)
    Perfect for caching API responses, vendor quotes, etc.
    """
    
    def __init__(self, default_ttl: int = 300):
        """
        Initialize cache
        
        Args:
            default_ttl: Default time-to-live in seconds (default: 5 minutes)
        """
        self._cache: Dict[str, Any] = {}
        self._expiry: Dict[str, datetime] = {}
        self._lock = Lock()
        self.default_ttl = default_ttl
        self.hits = 0
        self.misses = 0
        logger.info(f"💾 SimpleCache initialized (TTL: {default_ttl}s)")
    
    def get(self, key: str) -> Optional[Any]:
        """
        Get value from cache
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if not found/expired
        """
        with self._lock:
            if key in self._cache:
                if datetime.now() < self._expiry[key]:
                    self.hits += 1
                    logger.debug(f"💾 Cache HIT: {key}")
                    return self._cache[key]
                else:
                    # Expired, remove it
                    del self._cache[key]
                    del self._expiry[key]
                    self.misses += 1
                    logger.debug(f"⏰ Cache EXPIRED: {key}")
                    return None
            else:
                self.misses += 1
                logger.debug(f"❌ Cache MISS: {key}")
                return None
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """
        Set value in cache
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time-to-live in seconds (uses default if not specified)
        """
        with self._lock:
            ttl_seconds = ttl if ttl is not None else self.default_ttl
            self._cache[key] = value
            self._expiry[key] = datetime.now() + timedelta(seconds=ttl_seconds)
            logger.debug(f"💾 Cache SET: {key} (TTL: {ttl_seconds}s)")
    
    def delete(self, key: str) -> bool:
        """
        Delete value from cache
        
        Args:
            key: Cache key
            
        Returns:
            True if deleted, False if not found
        """
        with self._lock:
            if key in self._cache:
                del self._cache[key]
                del self._expiry[key]
                logger.debug(f"🗑️ Cache DELETE: {key}")
                return True
            return False
    
    def clear(self) -> None:
        """Clear all cache entries"""
        with self._lock:
            count = len(self._cache)
            self._cache.clear()
            self._expiry.clear()
            logger.info(f"🗑️ Cache cleared ({count} entries removed)")
    
    def cleanup_expired(self) -> int:
        """
        Remove all expired entries
        
        Returns:
            Number of entries removed
        """
        with self._lock:
            now = datetime.now()
            expired_keys = [
                key for key, expiry in self._expiry.items() 
                if now >= expiry
            ]
            
            for key in expired_keys:
                del self._cache[key]
                del self._expiry[key]
            
            if expired_keys:
                logger.info(f"🗑️ Cleaned up {len(expired_keys)} expired cache entries")
            
            return len(expired_keys)
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics
        
        Returns:
            Dictionary with cache stats
        """
        with self._lock:
            total_requests = self.hits + self.misses
            hit_rate = (self.hits / total_requests * 100) if total_requests > 0 else 0
            
            return {
                "entries": len(self._cache),
                "hits": self.hits,
                "misses": self.misses,
                "total_requests": total_requests,
                "hit_rate": f"{hit_rate:.2f}%",
                "size_bytes": sum(
                    len(str(k)) + len(str(v)) 
                    for k, v in self._cache.items()
                )
            }
    
    def __len__(self) -> int:
        """Return number of entries in cache"""
        return len(self._cache)
    
    def __contains__(self, key: str) -> bool:
        """Check if key exists and is not expired"""
        return self.get(key) is not None


# Global cache instance
cache = SimpleCache(default_ttl=300)  # 5 minutes default


# Convenience decorator for caching function results
def cached(ttl: int = 300, key_prefix: str = ""):
    """
    Decorator to cache function results
    
    Usage:
        @cached(ttl=600, key_prefix="quote")
        def get_quote(origin, dest):
            # expensive calculation
            return quote
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            cache_key = f"{key_prefix}:{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Try to get from cache
            result = cache.get(cache_key)
            if result is not None:
                return result
            
            # Calculate and cache
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl=ttl)
            return result
        
        return wrapper
    return decorator

