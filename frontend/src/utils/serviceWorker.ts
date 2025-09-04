// Service Worker Registration and PWA Management

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('SW registered: ', registration);

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content available
                  console.log('New content is available; please refresh.');
                  showUpdateNotification();
                } else {
                  // Content cached for offline use
                  console.log('Content is cached for offline use.');
                }
              }
            };
          });

          // Handle controller change
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('New service worker activated');
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}

// Show update notification
function showUpdateNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('MovedIn Update Available', {
      body: 'A new version is available. Click to refresh.',
      icon: '/icon-192x192.svg',
      badge: '/icon-192x192.svg',
      tag: 'update-available'
    });

    notification.onclick = () => {
      window.location.reload();
      notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
  }
}

// Request notification permission
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted');
      }
    });
  }
}

// Check if app is installed
export function isAppInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

// Install prompt handling
export function setupInstallPrompt() {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button or prompt
    showInstallPrompt();
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    // Hide install prompt
    hideInstallPrompt();
  });
}

// Show install prompt
function showInstallPrompt() {
  // You can customize this to show an install button
  console.log('Install prompt available');
  
  // Example: Create and show install button
  const installButton = document.createElement('button');
  installButton.textContent = 'Install MovedIn App';
  installButton.className = 'install-button';
  installButton.onclick = installApp;
  
  // Add to page (you can customize where)
  const header = document.querySelector('header');
  if (header) {
    header.appendChild(installButton);
  }
}

// Hide install prompt
function hideInstallPrompt() {
  const installButton = document.querySelector('.install-button');
  if (installButton) {
    installButton.remove();
  }
}

// Install app
async function installApp() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Installing MovedIn...', {
        body: 'Please wait while we install the app.',
        icon: '/icon-192x192.svg'
      });
      
      // Trigger install prompt
      // Note: This requires user interaction
      console.log('App installation initiated');
    } catch (error) {
      console.error('Error installing app:', error);
    }
  }
}

// Background sync registration
export function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then((registration) => {
      // Register background sync
      registration.sync.register('background-sync')
        .then(() => {
          console.log('Background sync registered');
        })
        .catch((error) => {
          console.error('Background sync registration failed:', error);
        });
    });
  }
}

// Push notification subscription
export async function subscribeToPushNotifications() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        console.log('Already subscribed to push notifications');
        return subscription;
      }

      // Subscribe to push notifications
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY || '')
      });

      console.log('Push notification subscription successful:', newSubscription);
      return newSubscription;
    } catch (error) {
      console.error('Push notification subscription failed:', error);
      throw error;
    }
  }
}

// Convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Unregister service worker (for development)
export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Check for updates
export function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }
}

// Get service worker status
export function getServiceWorkerStatus(): string {
  if (!('serviceWorker' in navigator)) {
    return 'not-supported';
  }
  
  if (navigator.serviceWorker.controller) {
    return 'active';
  }
  
  return 'installing';
}
