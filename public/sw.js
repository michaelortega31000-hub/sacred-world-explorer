// Service Worker for Web Push Notifications and Offline Mode
const CACHE_NAME = 'sacred-world-v2';
const STATIC_CACHE = 'sacred-world-static-v1';
const DYNAMIC_CACHE = 'sacred-world-dynamic-v1';
const MAP_CACHE = 'sacred-world-maps-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/placeholder.svg',
  '/images/place-placeholder.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('sacred-world-') && 
                     name !== CACHE_NAME && 
                     name !== STATIC_CACHE && 
                     name !== DYNAMIC_CACHE &&
                     name !== MAP_CACHE;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper: network-first with cache fallback
function networkFirst(request, cacheName) {
  return fetch(request)
    .then((response) => {
      if (response && response.ok && request.url.startsWith(self.location.origin)) {
        const clone = response.clone();
        caches.open(cacheName).then((cache) => cache.put(request, clone));
      }
      return response;
    })
    .catch(() => caches.match(request));
}

// Fetch event - network-first for app shell/scripts, cache-first for images/tiles
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Never intercept Vite dev/HMR or module graph
  if (
    url.pathname.startsWith('/@vite') ||
    url.pathname.startsWith('/@react-refresh') ||
    url.pathname.startsWith('/@id/') ||
    url.pathname.startsWith('/@fs/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.startsWith('/src/') ||
    url.search.includes('import') ||
    url.search.includes('t=')
  ) {
    return;
  }

  // Navigations (HTML) — always network-first so a new deploy is picked up
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // App scripts/styles — network-first to avoid serving stale chunks
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Mapbox tiles — cache-first
  if (url.hostname.includes('mapbox.com') && url.pathname.includes('/tiles/')) {
    event.respondWith(
      caches.open(MAP_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            return new Response('', { status: 404 });
          });
        });
      })
    );
    return;
  }

  // API requests - network-first
  if (url.pathname.includes('/rest/') || url.pathname.includes('/functions/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Images - cache-first with placeholder fallback
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          return caches.match('/images/place-placeholder.jpg');
        });
      })
    );
    return;
  }

  // Default: network-first
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Notification', body: event.data.text() };
    }
  }

  const title = data.title || 'Sacred World';
  const options = {
    body: data.body || 'Vous avez une nouvelle notification',
    icon: data.icon || '/logo-icon.png',
    badge: '/logo-icon.png',
    tag: data.tag || 'general',
    data: {
      url: data.url || '/calendar'
    },
    vibrate: [200, 100, 200],
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/calendar';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle push subscription change
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW] Push subscription changed');
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options)
      .then((subscription) => {
        console.log('[SW] Resubscribed after subscription change');
        return subscription;
      })
  );
});

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return Promise.all(
          urls.map((url) => {
            return fetch(url).then((response) => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(() => {
              console.log('[SW] Failed to cache:', url);
            });
          })
        );
      }).then(() => {
        if (event.ports[0]) {
          event.ports[0].postMessage({ success: true });
        }
      })
    );
  }
});
