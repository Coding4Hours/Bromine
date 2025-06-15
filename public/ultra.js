importScripts("https://brominecdn.netlify.app/uv/uv.bundle.js")
importScripts("uv.config.js")
importScripts(__uv$config.sw)
importScripts("/scram/scramjet.shared.js", "/scram/scramjet.worker.js")

if (navigator.userAgent.includes("Firefox")) {
  Object.defineProperty(globalThis, "crossOriginIsolated", {
    value: true,
    writable: true,
  })
}

const uv = new UVServiceWorker()
const scramjet = new ScramjetServiceWorker()

const CONTENT_CACHE_NAME = "MyFancyCacheName_v1"

self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CONTENT_CACHE_NAME))
})

self.addEventListener("fetch", async (event) => {
  await scramjet.loadConfig()
  if (scramjet.route(event)) {
    event.respondWith(scramjet.fetch(event))
  } else if (uv.route(event)) {
    const uva = await uv.fetch(event)
    event.respondWith(uva)
  } else {
    // 2. Cache-First, Network-Second strategy for other requests
    // This part handles all requests that are NOT intercepted by Scramjet or UV.
    const request = event.request

    // IMPORTANT: Do not cache POST requests or range requests, etc.
    if (
      request.method !== "GET" ||
      request.url.startsWith("chrome-extension://")
    ) {
      return fetch(request)
    }

    const cache = await caches.open(CONTENT_CACHE_NAME)

    // Try to find the request in the cache first
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      console.log(`[SW] Serving from cache: ${request.url}`)
      return cachedResponse
    }

    // If not in cache, go to the network
    try {
      // Clone the request because it can only be consumed once
      const networkResponse = await fetch(request.clone())

      // Check if the response is valid to cache (e.g., 200 OK)
      // Opaque responses (cross-origin without CORS) also have status 0 and type 'opaque'
      if (networkResponse.ok || networkResponse.type === "opaque") {
        // Clone the response because it can only be consumed once
        // One copy for the browser, one for the cache
        console.log(`[SW] Caching new response: ${request.url}`)
        await cache.put(request, networkResponse.clone())
      } else {
        console.warn(
          `[SW] Not caching non-ok/opaque response (${networkResponse.status} ${networkResponse.type}): ${request.url}`,
        )
      }

      return networkResponse
    } catch (error) {
      console.error(`[SW] Fetch failed and no cache for ${request.url}:`, error)
      // If both cache and network fail, you might want to return a generic fallback page
      // For now, return a network error response
      return new Response(
        "Network error and no cache available for this resource.",
        {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        },
      )
    }
  }
})
