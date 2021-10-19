/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "36c4dbaee1eda04c5aae68371f9cfeaa"
  },
  {
    "url": "assets/css/0.styles.c9d52bfa.css",
    "revision": "e614591d861b652cd0ad15d24b36d40e"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.a6c0b13e.js",
    "revision": "6b80cc28469bce72b7aa95bc0603921f"
  },
  {
    "url": "assets/js/11.09a732cd.js",
    "revision": "a33eeacfc33376ac48b14bfa28e17920"
  },
  {
    "url": "assets/js/12.74008f2b.js",
    "revision": "8c8c17b5f80cf110a1bd85ce8ff0225b"
  },
  {
    "url": "assets/js/3.8600081c.js",
    "revision": "27b2d20117df2c05158c58f8e8bb4021"
  },
  {
    "url": "assets/js/4.305840cb.js",
    "revision": "4f9e42d05586d08786e83942127f249e"
  },
  {
    "url": "assets/js/5.d055cc6c.js",
    "revision": "1ce9763e64016f5d77bcb5c6f7edc710"
  },
  {
    "url": "assets/js/6.51181fc4.js",
    "revision": "fc8566df9bf14ba7edcc29b789c096ad"
  },
  {
    "url": "assets/js/7.313456ac.js",
    "revision": "2d25064ea05e8d65869a742911c2243c"
  },
  {
    "url": "assets/js/8.583c1358.js",
    "revision": "220c7c71bbf415b1c5147c59344c2870"
  },
  {
    "url": "assets/js/9.b8d4bf82.js",
    "revision": "1d394323b216dba744ce8404d0a5976f"
  },
  {
    "url": "assets/js/app.f52e6e5c.js",
    "revision": "5f77cfb03797f015f7fae6e7123cb32e"
  },
  {
    "url": "assets/js/vendors~flowchart.9a672344.js",
    "revision": "c4fc00e394f448fb76ad1a676dbe7dec"
  },
  {
    "url": "config/index.html",
    "revision": "f47db560adfda83b0df754fcbeb9d243"
  },
  {
    "url": "favicon.png",
    "revision": "24f7a4fadfc7a9a3c117e94a8c64ee0f"
  },
  {
    "url": "github.svg",
    "revision": "5a14e36c8b0b5e4ba427f47fca304477"
  },
  {
    "url": "guide/index.html",
    "revision": "9a8e71ef71f3f399a4c2ab591c645776"
  },
  {
    "url": "icons/android-chrome-192x192.png",
    "revision": "2ae129bfbc670ddbc5d83130fdca51fb"
  },
  {
    "url": "icons/android-chrome-512x512.png",
    "revision": "b9a6b0d549941f5938bbbc106f19b0a6"
  },
  {
    "url": "icons/apple-touch-icon-120x120.png",
    "revision": "45a3cf74cc54976ac5eaf03ee8451eac"
  },
  {
    "url": "icons/apple-touch-icon-152x152.png",
    "revision": "c22351d8fe58c26e346cd9d8370e8ff7"
  },
  {
    "url": "icons/apple-touch-icon-180x180.png",
    "revision": "2409468249cc81a1dba5e16b6cb3fee2"
  },
  {
    "url": "icons/apple-touch-icon-60x60.png",
    "revision": "569ba17f0b57bd947718f5e8b8345868"
  },
  {
    "url": "icons/apple-touch-icon-76x76.png",
    "revision": "172d0bea737e2d830879364b85452448"
  },
  {
    "url": "icons/apple-touch-icon.png",
    "revision": "2409468249cc81a1dba5e16b6cb3fee2"
  },
  {
    "url": "icons/favicon-16x16.png",
    "revision": "b0f966ce21204938666d3b76146f3216"
  },
  {
    "url": "icons/favicon-32x32.png",
    "revision": "2956e5675d6247e0e540b1ab30681412"
  },
  {
    "url": "icons/msapplication-icon-144x144.png",
    "revision": "958b57c19149628a3c387108247dc15a"
  },
  {
    "url": "icons/mstile-150x150.png",
    "revision": "6b18d32232681d531a8c949c8e8beb62"
  },
  {
    "url": "index.html",
    "revision": "10ad3bf591992a5edfd8bf895d17d661"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
