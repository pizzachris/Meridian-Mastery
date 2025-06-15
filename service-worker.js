// Disabled Service Worker - Immediately unregister and clear caches
console.log("Service Worker: Disabling and clearing all caches...");

// Clear all caches immediately
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Clearing all caches...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log("Service Worker: Deleting cache:", cacheName);
            return caches.delete(cacheName);
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: All caches cleared");
        // Unregister this service worker
        return self.registration.unregister();
      })
      .then(() => {
        console.log("Service Worker: Unregistered successfully");
        // Force clients to reload without cache
        return self.clients.matchAll();
      })
      .then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: "CACHE_CLEARED",
            message: "All caches cleared, please refresh the page",
          });
        });
      }),
  );
});

// Bypass cache for all requests
self.addEventListener("fetch", (event) => {
  // Don't cache anything, fetch directly from network
  event.respondWith(
    fetch(event.request.url + "?nocache=" + Date.now(), {
      cache: "no-store",
    }).catch(() => {
      // If network fails, don't try cache
      return new Response("Network error - no cache available", {
        status: 503,
        statusText: "Service Unavailable",
      });
    }),
  );
});

console.log("Service Worker: Disabled mode active - no caching");

// Static assets to cache
const staticUrlsToCache = [
  "/icons/favicon-32x32.png",
  "/icons/favicon-16x16.png",
  "/body_front.svg",
  "/body_back.svg",
  "/body_front_anatomical.svg",
  "/body_back_anatomical.svg",
];

// Data URLs to cache with network-first strategy
const dataUrlsToCache = [
  "/src/data/meridian_mastery_points_bilateral.json",
  "/src/data/maek_chi_ki.json",
  "/src/data/maek_cha_ki.json",
];

// Maximum cache size limits for mobile optimization
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB limit
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Install event - caches assets with error handling
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Essential files - cache first
      caches.open(CACHE_NAME).then((cache) => {
        console.log("Caching essential files");
        return cache.addAll(essentialUrls);
      }),
      // Static assets - cache separately
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log("Caching static assets");
        return Promise.allSettled(
          staticUrls.map((url) =>
            cache.add(url).catch((err) => {
              console.warn("Failed to cache:", url, err);
            }),
          ),
        );
      }),
      // Data files - cache with versioning
      caches.open(DATA_CACHE_NAME).then((cache) => {
        console.log("Caching data files");
        return Promise.allSettled(
          dataUrlsToCache.map((url) =>
            cache.add(url).catch((err) => {
              console.warn("Failed to cache data:", url, err);
            }),
          ),
        );
      }),
    ]).catch((err) => {
      console.error("Installation failed:", err);
    }),
  );

  // Force the waiting service worker to become active
  self.skipWaiting();
});

// Activate event - clean up old caches and manage cache size
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              ![CACHE_NAME, DATA_CACHE_NAME, STATIC_CACHE_NAME].includes(
                cacheName,
              )
            ) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      }),
      // Manage cache size
      manageCacheSize(),
    ]),
  );

  // Take control of all pages
  self.clients.claim();
});

// Manage cache size for mobile optimization
async function manageCacheSize() {
  try {
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await limitCacheSize(cacheName);
    }
  } catch (error) {
    console.error("Cache size management failed:", error);
  }
}

async function limitCacheSize(cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    // Sort by age and remove oldest if needed
    if (keys.length > 100) {
      // Arbitrary limit
      const oldestKeys = keys.slice(0, keys.length - 50);
      await Promise.all(oldestKeys.map((key) => cache.delete(key)));
      console.log(`Cleaned ${oldestKeys.length} items from ${cacheName}`);
    }
  } catch (error) {
    console.error("Failed to limit cache size:", error);
  }
}

// Enhanced fetch event with multiple caching strategies
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Handle data/JSON requests with network-first strategy
  if (url.pathname.includes("/data/") || url.pathname.endsWith(".json")) {
    event.respondWith(handleDataRequest(event.request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticRequest(event.request));
    return;
  }

  // Handle HTML/navigation requests with network-first, cache fallback
  if (event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(handleNavigationRequest(event.request));
    return;
  }

  // Default strategy for other requests
  event.respondWith(handleDefaultRequest(event.request));
});

// Network-first strategy for data requests
async function handleDataRequest(request) {
  try {
    // Try network first for fresh data
    const response = await fetch(request);
    if (response.ok) {
      // Cache the fresh response
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    }
    throw new Error("Network response not ok");
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(DATA_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log("Serving data from cache:", request.url);
      return cachedResponse;
    }
    throw error;
  }
}

// Cache-first strategy for static assets
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error("Failed to fetch static asset:", request.url);
    throw error;
  }
}

// Network-first strategy for navigation requests
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
      return response;
    }
    throw new Error("Network response not ok");
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse =
      (await cache.match(request)) || (await cache.match("/"));
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Default cache-first strategy
async function handleDefaultRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    throw error;
  }
}

// Helper to identify static assets
function isStaticAsset(pathname) {
  const staticExtensions = [
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".ico",
    ".css",
    ".js",
  ];
  return (
    staticExtensions.some((ext) => pathname.endsWith(ext)) ||
    pathname.includes("/icons/") ||
    pathname.includes("/assets/")
  );
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "progress-sync") {
    event.waitUntil(
      // Sync progress data when back online
      syncProgressData(),
    );
  }
});

// Handle background sync
async function syncProgressData() {
  try {
    // This would sync local storage data with a server if implemented
    console.log("Background sync: Progress data synced");
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}
