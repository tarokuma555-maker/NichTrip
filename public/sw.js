// AnimeTrips Service Worker
// Cache versioning - bump this to invalidate all caches on update
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `animetrips-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `animetrips-dynamic-${CACHE_VERSION}`;

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/offline.html',
];

// File extensions that should use cache-first strategy
const STATIC_EXTENSIONS = [
  '.js', '.css', '.woff', '.woff2', '.ttf', '.otf', '.eot',
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
];

// Install: pre-cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Helper: check if a request is for a static asset
function isStaticAsset(url) {
  return STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
}

// Helper: check if a request is a navigation (HTML page) or API call
function isNavigationOrAPI(request, url) {
  return request.mode === 'navigate' || url.pathname.startsWith('/api/');
}

// Fetch: apply appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  if (isStaticAsset(url)) {
    // Cache-first for static assets
    event.respondWith(cacheFirst(request));
  } else if (isNavigationOrAPI(request, url)) {
    // Network-first for HTML pages and API routes
    event.respondWith(networkFirst(request));
  }
});

// Cache-first strategy: serve from cache, fallback to network
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Static asset unavailable offline - return a basic error
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

// Network-first strategy: try network, fallback to cache, then offline page
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // If it's a navigation request, show the offline fallback page
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }

    return new Response('', { status: 408, statusText: 'Offline' });
  }
}
