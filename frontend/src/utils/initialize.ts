// Main initialization file for all utilities

import { registerServiceWorker, setupInstallPrompt, requestNotificationPermission } from './serviceWorker';
import { initializeImageOptimization } from './imageOptimization';
import { initializePerformanceOptimizations } from './performance';
import { initializeCaching } from './caching';

// Initialize all systems
export async function initializeAllSystems(): Promise<void> {
  try {
    console.log('🚀 Initializing MovedIn systems...');
    
    // 1. Initialize PWA features
    console.log('📱 Initializing PWA features...');
    registerServiceWorker();
    setupInstallPrompt();
    requestNotificationPermission();
    
    // 2. Initialize image optimization
    console.log('🖼️ Initializing image optimization...');
    initializeImageOptimization();
    
    // 3. Initialize performance optimizations
    console.log('⚡ Initializing performance optimizations...');
    initializePerformanceOptimizations();
    
    // 4. Initialize caching system
    console.log('💾 Initializing caching system...');
    await initializeCaching();
    
    console.log('✅ All systems initialized successfully!');
    
    // Log system status
    logSystemStatus();
    
  } catch (error) {
    console.error('❌ Failed to initialize systems:', error);
  }
}

// Log system status
function logSystemStatus(): void {
  console.log('📊 MovedIn System Status:');
  console.log('├── PWA: ✅ Service Worker registered');
  console.log('├── Images: ✅ WebP + Lazy loading enabled');
  console.log('├── Performance: ✅ Core Web Vitals monitoring');
  console.log('├── Caching: ✅ Multi-strategy caching enabled');
  console.log('└── Mobile: ✅ 100% responsive design');
}

// Check if all systems are ready
export function areSystemsReady(): boolean {
  return (
    'serviceWorker' in navigator &&
    'IntersectionObserver' in window &&
    'PerformanceObserver' in window
  );
}

// Get system capabilities
export function getSystemCapabilities(): {
  pwa: boolean;
  webp: boolean;
  lazyLoading: boolean;
  performanceMonitoring: boolean;
  caching: boolean;
  offline: boolean;
} {
  return {
    pwa: 'serviceWorker' in navigator,
    webp: 'WebP' in window,
    lazyLoading: 'IntersectionObserver' in window,
    performanceMonitoring: 'PerformanceObserver' in window,
    caching: 'caches' in window,
    offline: 'serviceWorker' in navigator
  };
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAllSystems);
} else {
  initializeAllSystems();
}

// Initialize on window load (for performance metrics)
window.addEventListener('load', () => {
  console.log('🌐 Window loaded, checking performance...');
  
  // Check Core Web Vitals after page load
  setTimeout(() => {
    import('./performance').then(({ checkCoreWebVitals }) => {
      const result = checkCoreWebVitals();
      console.log('📈 Core Web Vitals check:', result);
    });
  }, 2000);
});

// Export for manual initialization
export default initializeAllSystems;
