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
    "revision": "b11be2be0f001c5b095f721076a7e8bb"
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
    "url": "assets/js/app.39d419ac.js",
    "revision": "e84cf41c8bf8f35993368601756e9009"
  },
  {
    "url": "assets/js/vendors~flowchart.9a672344.js",
    "revision": "c4fc00e394f448fb76ad1a676dbe7dec"
  },
  {
    "url": "config/index.html",
    "revision": "1e8233eb357c173b5e4b190131dce5f0"
  },
  {
    "url": "favicon.png",
    "revision": "2f1a57cca765bda69f1c600d46a0e1de"
  },
  {
    "url": "github.svg",
    "revision": "5a14e36c8b0b5e4ba427f47fca304477"
  },
  {
    "url": "guide/index.html",
    "revision": "3f140ec0a22b9da06f6042035a036382"
  },
  {
    "url": "icons/android-chrome-192x192.png",
    "revision": "1531b0587fe1a93e0ee977abeddc76b1"
  },
  {
    "url": "icons/android-chrome-512x512.png",
    "revision": "eb847313de53d872ad57fd19b1a48687"
  },
  {
    "url": "icons/apple-touch-icon-120x120.png",
    "revision": "b45e43cf877bd58a352c8a3435fe751a"
  },
  {
    "url": "icons/apple-touch-icon-152x152.png",
    "revision": "2d7d5c1d3e6546407082937f06699f02"
  },
  {
    "url": "icons/apple-touch-icon-180x180.png",
    "revision": "594030e5de64f5012c1b4757b221b67b"
  },
  {
    "url": "icons/apple-touch-icon-60x60.png",
    "revision": "9f62ca7aa5cab2018826eb1634805d9e"
  },
  {
    "url": "icons/apple-touch-icon-76x76.png",
    "revision": "cec7a8dc2209faeebaa95cbbf22bfe54"
  },
  {
    "url": "icons/apple-touch-icon.png",
    "revision": "594030e5de64f5012c1b4757b221b67b"
  },
  {
    "url": "icons/favicon-16x16.png",
    "revision": "8d2e43ed1eb3a434eee64faa67ac83cf"
  },
  {
    "url": "icons/favicon-32x32.png",
    "revision": "3b7bddf92ad8111627170bbd01578fc4"
  },
  {
    "url": "icons/msapplication-icon-144x144.png",
    "revision": "770f20229570636a4849f17245c501a3"
  },
  {
    "url": "icons/mstile-150x150.png",
    "revision": "86ecd6daca0623d2f21dfe92636fbd67"
  },
  {
    "url": "index.html",
    "revision": "93ec94811f26679491e21e9e1e2c0bf1"
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
