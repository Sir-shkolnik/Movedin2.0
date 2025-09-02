// Caching Strategy and Cache Management

// Cache configuration
const CACHE_CONFIG = {
  // Static assets cache
  static: {
    name: 'movedin-static-v1.0.0',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    maxEntries: 100
  },
  
  // Dynamic content cache
  dynamic: {
    name: 'movedin-dynamic-v1.0.0',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    maxEntries: 50
  },
  
  // API responses cache
  api: {
    name: 'movedin-api-v1.0.0',
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 30
  }
};

// Cache strategies
export enum CacheStrategy {
  CACHE_FIRST = 'cache-first',
  NETWORK_FIRST = 'network-first',
  STALE_WHILE_REVALIDATE = 'stale-while-revalidate',
  NETWORK_ONLY = 'network-only',
  CACHE_ONLY = 'cache-only'
}

// Cache entry interface
interface CacheEntry {
  url: string;
  response: Response;
  timestamp: number;
  expires: number;
}

// Cache manager class
class CacheManager {
  private caches: Map<string, Cache> = new Map();
  private cacheEntries: Map<string, CacheEntry[]> = new Map();

  // Initialize cache manager
  async initialize(): Promise<void> {
    try {
      // Open all caches
      for (const [key, config] of Object.entries(CACHE_CONFIG)) {
        const cache = await caches.open(config.name);
        this.caches.set(key, cache);
        this.cacheEntries.set(key, []);
      }
      
      // Clean up expired entries
      this.cleanupExpiredEntries();
      
      console.log('Cache manager initialized');
    } catch (error) {
      console.error('Failed to initialize cache manager:', error);
    }
  }

  // Get cache by type
  getCache(type: keyof typeof CACHE_CONFIG): Cache | undefined {
    return this.caches.get(type);
  }

  // Add entry to cache
  async addToCache(
    type: keyof typeof CACHE_CONFIG,
    url: string,
    response: Response,
    customMaxAge?: number
  ): Promise<void> {
    try {
      const cache = this.getCache(type);
      if (!cache) return;

      const config = CACHE_CONFIG[type];
      const maxAge = customMaxAge || config.maxAge;
      const timestamp = Date.now();
      const expires = timestamp + maxAge;

      // Clone response for caching
      const responseClone = response.clone();
      
      // Store in cache
      await cache.put(url, responseClone);
      
      // Store metadata
      const entries = this.cacheEntries.get(type) || [];
      entries.push({
        url,
        response: responseClone,
        timestamp,
        expires
      });
      this.cacheEntries.set(type, entries);
      
      // Clean up if too many entries
      if (entries.length > config.maxEntries) {
        this.cleanupCache(type);
      }
      
    } catch (error) {
      console.error('Failed to add to cache:', error);
    }
  }

  // Get entry from cache
  async getFromCache(
    type: keyof typeof CACHE_CONFIG,
    url: string
  ): Promise<Response | null> {
    try {
      const cache = this.getCache(type);
      if (!cache) return null;

      const response = await cache.match(url);
      if (!response) return null;

      // Check if expired
      const entries = this.cacheEntries.get(type) || [];
      const entry = entries.find(e => e.url === url);
      
      if (entry && Date.now() > entry.expires) {
        // Remove expired entry
        await cache.delete(url);
        this.removeCacheEntry(type, url);
        return null;
      }

      return response;
    } catch (error) {
      console.error('Failed to get from cache:', error);
      return null;
    }
  }

  // Remove entry from cache
  async removeFromCache(
    type: keyof typeof CACHE_CONFIG,
    url: string
  ): Promise<void> {
    try {
      const cache = this.getCache(type);
      if (cache) {
        await cache.delete(url);
        this.removeCacheEntry(type, url);
      }
    } catch (error) {
      console.error('Failed to remove from cache:', error);
    }
  }

  // Remove cache entry metadata
  private removeCacheEntry(type: keyof typeof CACHE_CONFIG, url: string): void {
    const entries = this.cacheEntries.get(type) || [];
    const filteredEntries = entries.filter(e => e.url !== url);
    this.cacheEntries.set(type, filteredEntries);
  }

  // Clean up expired entries
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    
    for (const [type, entries] of this.cacheEntries.entries()) {
      const validEntries = entries.filter(e => now <= e.expires);
      this.cacheEntries.set(type, validEntries);
      
      // Remove expired entries from cache
      entries.forEach(async (entry) => {
        if (now > entry.expires) {
          const cache = this.getCache(type as keyof typeof CACHE_CONFIG);
          if (cache) {
            await cache.delete(entry.url);
          }
        }
      });
    }
  }

  // Clean up cache by type
  private async cleanupCache(type: keyof typeof CACHE_CONFIG): Promise<void> {
    try {
      const cache = this.getCache(type);
      if (!cache) return;

      const config = CACHE_CONFIG[type];
      const entries = this.cacheEntries.get(type) || [];
      
      if (entries.length > config.maxEntries) {
        // Sort by timestamp (oldest first)
        entries.sort((a, b) => a.timestamp - b.timestamp);
        
        // Remove oldest entries
        const toRemove = entries.slice(0, entries.length - config.maxEntries);
        
        for (const entry of toRemove) {
          await cache.delete(entry.url);
        }
        
        // Update metadata
        const remainingEntries = entries.slice(entries.length - config.maxEntries);
        this.cacheEntries.set(type, remainingEntries);
      }
    } catch (error) {
      console.error('Failed to cleanup cache:', error);
    }
  }

  // Clear all caches
  async clearAllCaches(): Promise<void> {
    try {
      for (const [type, cache] of this.caches.entries()) {
        await cache.clear();
        this.cacheEntries.set(type, []);
      }
      console.log('All caches cleared');
    } catch (error) {
      console.error('Failed to clear caches:', error);
    }
  }

  // Get cache statistics
  getCacheStats(): { [key: string]: { entries: number; size: number } } {
    const stats: { [key: string]: { entries: number; size: number } } = {};
    
    for (const [type, entries] of this.cacheEntries.entries()) {
      stats[type] = {
        entries: entries.length,
        size: entries.reduce((total, entry) => total + entry.response.headers.get('content-length') || 0, 0)
      };
    }
    
    return stats;
  }
}

// Create global cache manager instance
export const cacheManager = new CacheManager();

// Cache strategy implementations
export class CacheStrategies {
  // Cache first strategy
  static async cacheFirst(
    request: Request,
    cacheType: keyof typeof CACHE_CONFIG = 'static'
  ): Promise<Response> {
    // Try cache first
    const cachedResponse = await cacheManager.getFromCache(cacheType, request.url);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cacheManager.addToCache(cacheType, request.url, response);
      }
      return response;
    } catch (error) {
      // Return offline response if available
      const offlineResponse = await cacheManager.getFromCache('static', '/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
      throw error;
    }
  }

  // Network first strategy
  static async networkFirst(
    request: Request,
    cacheType: keyof typeof CACHE_CONFIG = 'dynamic'
  ): Promise<Response> {
    try {
      // Try network first
      const response = await fetch(request);
      if (response.ok) {
        await cacheManager.addToCache(cacheType, request.url, response);
      }
      return response;
    } catch (error) {
      // Fallback to cache
      const cachedResponse = await cacheManager.getFromCache(cacheType, request.url);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  }

  // Stale while revalidate strategy
  static async staleWhileRevalidate(
    request: Request,
    cacheType: keyof typeof CACHE_CONFIG = 'dynamic'
  ): Promise<Response> {
    // Return cached response immediately if available
    const cachedResponse = await cacheManager.getFromCache(cacheType, request.url);
    
    // Revalidate in background
    fetch(request).then(async (response) => {
      if (response.ok) {
        await cacheManager.addToCache(cacheType, request.url, response);
      }
    }).catch(console.error);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, wait for network
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cacheManager.addToCache(cacheType, request.url, response);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Network only strategy
  static async networkOnly(request: Request): Promise<Response> {
    return fetch(request);
  }

  // Cache only strategy
  static async cacheOnly(
    request: Request,
    cacheType: keyof typeof CACHE_CONFIG = 'static'
  ): Promise<Response> {
    const cachedResponse = await cacheManager.getFromCache(cacheType, request.url);
    if (!cachedResponse) {
      throw new Error('Not found in cache');
    }
    return cachedResponse;
  }
}

// Browser caching headers
export function setCacheHeaders(response: Response, maxAge: number): Response {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', `public, max-age=${maxAge}`);
  headers.set('Expires', new Date(Date.now() + maxAge).toUTCString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// Cache invalidation
export function invalidateCache(pattern: string | RegExp): void {
  // This would be called when content changes
  // For now, we'll just log it
  console.log('Cache invalidation requested for pattern:', pattern);
  
  // In a real implementation, you might:
  // 1. Clear specific cache entries
  // 2. Update cache version numbers
  // 3. Send messages to service worker
}

// Initialize caching system
export async function initializeCaching(): Promise<void> {
  await cacheManager.initialize();
  console.log('Caching system initialized');
}

// Export cache manager instance
export { cacheManager as default };
