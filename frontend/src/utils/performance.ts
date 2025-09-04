// Performance Optimization and Core Web Vitals

// Core Web Vitals thresholds
const CORE_WEB_VITALS = {
  LCP: 2500, // Largest Contentful Paint (2.5s)
  FID: 100,  // First Input Delay (100ms)
  CLS: 0.1   // Cumulative Layout Shift (0.1)
};

// Performance metrics
let performanceMetrics: {
  LCP?: number;
  FID?: number;
  CLS?: number;
  FCP?: number;
  TTFB?: number;
} = {};

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if ('PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      performanceMetrics.LCP = lastEntry.startTime;
      
      console.log('LCP:', performanceMetrics.LCP);
      
      if (performanceMetrics.LCP > CORE_WEB_VITALS.LCP) {
        console.warn('LCP is above threshold:', performanceMetrics.LCP);
      }
    });
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer failed:', e);
    }

    // Monitor First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        performanceMetrics.FID = entry.processingStart - entry.startTime;
        console.log('FID:', performanceMetrics.FID);
        
        if (performanceMetrics.FID > CORE_WEB_VITALS.FID) {
          console.warn('FID is above threshold:', performanceMetrics.FID);
        }
      });
    });
    
    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer failed:', e);
    }

    // Monitor Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      performanceMetrics.CLS = clsValue;
      console.log('CLS:', performanceMetrics.CLS);
      
      if (performanceMetrics.CLS > CORE_WEB_VITALS.CLS) {
        console.warn('CLS is above threshold:', performanceMetrics.CLS);
      }
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer failed:', e);
    }

    // Monitor First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0];
      performanceMetrics.FCP = firstEntry.startTime;
      console.log('FCP:', performanceMetrics.FCP);
    });
    
    try {
      fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });
    } catch (e) {
      console.warn('FCP observer failed (not supported in this browser):', e);
    }
  }

  // Monitor Time to First Byte (TTFB)
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      performanceMetrics.TTFB = navigation.responseStart - navigation.requestStart;
      console.log('TTFB:', performanceMetrics.TTFB);
    }
  }
}

// Get current performance metrics
export function getPerformanceMetrics() {
  return { ...performanceMetrics };
}

// Check if Core Web Vitals meet thresholds
export function checkCoreWebVitals(): {
  passed: boolean;
  details: { [key: string]: { value: number; threshold: number; passed: boolean } };
} {
  const details: { [key: string]: { value: number; threshold: number; passed: boolean } } = {};
  let allPassed = true;

  if (performanceMetrics.LCP !== undefined) {
    const passed = performanceMetrics.LCP <= CORE_WEB_VITALS.LCP;
    details.LCP = {
      value: performanceMetrics.LCP,
      threshold: CORE_WEB_VITALS.LCP,
      passed
    };
    if (!passed) allPassed = false;
  }

  if (performanceMetrics.FID !== undefined) {
    const passed = performanceMetrics.FID <= CORE_WEB_VITALS.FID;
    details.FID = {
      value: performanceMetrics.FID,
      threshold: CORE_WEB_VITALS.FID,
      passed
    };
    if (!passed) allPassed = false;
  }

  if (performanceMetrics.CLS !== undefined) {
    const passed = performanceMetrics.CLS <= CORE_WEB_VITALS.CLS;
    details.CLS = {
      value: performanceMetrics.CLS,
      threshold: CORE_WEB_VITALS.CLS,
      passed
    };
    if (!passed) allPassed = false;
  }

  return { passed: allPassed, details };
}

// Resource hints for performance
export function addResourceHints() {
  const head = document.head;
  
  // DNS prefetch for external domains
  const dnsPrefetch = [
    'https://api.stripe.com',
    'https://maps.googleapis.com',
    'https://api.mapbox.com'
  ];
  
  dnsPrefetch.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    head.appendChild(link);
  });

  // Preconnect to critical domains
  const preconnect = [
    'https://api.stripe.com',
    'https://maps.googleapis.com'
  ];
  
  preconnect.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    head.appendChild(link);
  });

  // Preload critical resources - Removed to fix 404 warnings
  const preload: Array<{href: string, as: string}> = [];
  
  preload.forEach(({ href, as }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as as any;
    head.appendChild(link);
  });
}

// Optimize images for performance
export function optimizeImages() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Add loading="lazy" for images below the fold
    if (!img.loading) {
      img.loading = 'lazy';
    }
    
    // Add decoding="async" for better performance
    if (!img.decoding) {
      img.decoding = 'async';
    }
    
    // Add fetchpriority for above-the-fold images
    if (img.classList.contains('hero') || img.classList.contains('above-fold')) {
      img.fetchPriority = 'high';
    }
  });
}

// Optimize fonts for performance
export function optimizeFonts() {
  // Font optimization disabled to prevent preload warnings
  console.log('Font optimization disabled to prevent console warnings');
}

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Performance budget monitoring
export function checkPerformanceBudget() {
  const budget = {
    totalSize: 500 * 1024, // 500KB
    totalRequests: 20,
    totalTime: 3000 // 3s
  };

  const currentMetrics = getPerformanceMetrics();
  const violations: string[] = [];

  if (currentMetrics.LCP && currentMetrics.LCP > budget.totalTime) {
    violations.push(`LCP (${currentMetrics.LCP}ms) exceeds budget (${budget.totalTime}ms)`);
  }

  if (violations.length > 0) {
    console.warn('Performance budget violations:', violations);
  }

  return violations;
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const used = memory.usedJSHeapSize / 1024 / 1024; // MB
    const total = memory.totalJSHeapSize / 1024 / 1024; // MB
    const limit = memory.jsHeapSizeLimit / 1024 / 1024; // MB
    
    console.log(`Memory: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB (${limit.toFixed(2)}MB limit)`);
    
    if (used / limit > 0.8) {
      console.warn('Memory usage is high (>80%)');
    }
  }
}

// Network information monitoring
export function monitorNetworkInfo() {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    console.log('Network:', {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    });
  }
}

// Initialize all performance optimizations
export function initializePerformanceOptimizations() {
  // Add resource hints
  addResourceHints();
  
  // Optimize images
  optimizeImages();
  
  // Optimize fonts
  optimizeFonts();
  
  // Initialize performance monitoring
  initializePerformanceMonitoring();
  
  // Monitor memory and network
  setInterval(monitorMemoryUsage, 30000); // Every 30 seconds
  setInterval(monitorNetworkInfo, 60000); // Every minute
  
  console.log('Performance optimizations initialized');
}

// Export performance utilities
export {
  CORE_WEB_VITALS,
  performanceMetrics
};
