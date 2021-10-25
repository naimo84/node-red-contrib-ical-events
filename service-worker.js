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
    "revision": "399e8ca5ee29d144b6c02292e687e882"
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
    "url": "assets/js/10.e5ab3b1e.js",
    "revision": "969501898eedb9cabb892c4d5c646b1f"
  },
  {
    "url": "assets/js/11.2955dfb2.js",
    "revision": "9830283f0bd257c47532db39d9187085"
  },
  {
    "url": "assets/js/12.fb391816.js",
    "revision": "8be61b498bad1539a3d207c617ceb676"
  },
  {
    "url": "assets/js/13.a76fb873.js",
    "revision": "2dd149d2ab9469f7e4507649286130ce"
  },
  {
    "url": "assets/js/14.e179f1f3.js",
    "revision": "fcc3898be3d3786b648d8a30450dc1f8"
  },
  {
    "url": "assets/js/15.c557277f.js",
    "revision": "32e3e7aaf0ee2a27856f3b25536164dd"
  },
  {
    "url": "assets/js/16.1c695753.js",
    "revision": "a12beac400457d0e4dfebb44ca3c85a6"
  },
  {
    "url": "assets/js/17.ff029007.js",
    "revision": "208672411c69a27f675dbfac71ba22cd"
  },
  {
    "url": "assets/js/3.d8142a39.js",
    "revision": "9b41819f6fb962d77f15d605e670540d"
  },
  {
    "url": "assets/js/4.c1cea7ba.js",
    "revision": "4c0762cd041468dda545259a05007b58"
  },
  {
    "url": "assets/js/5.3f7a629e.js",
    "revision": "3bba8d62098992e5599171735f5de353"
  },
  {
    "url": "assets/js/6.de883dc2.js",
    "revision": "2c59a637c1a69b00f1f8d4ef272dee8a"
  },
  {
    "url": "assets/js/7.4af94d5c.js",
    "revision": "4f8dd3444bc54246778e27c5aefcb9a5"
  },
  {
    "url": "assets/js/8.1bdd5e54.js",
    "revision": "0280bee05fbb0fb6459ceeb2ca7ecb29"
  },
  {
    "url": "assets/js/9.8233dc9b.js",
    "revision": "68dd01ce2923f7aa3694d31dfd554a62"
  },
  {
    "url": "assets/js/app.4819ce4e.js",
    "revision": "7d124128b4022e666a6533bb3b660190"
  },
  {
    "url": "assets/js/vendors~flowchart.171a5f9d.js",
    "revision": "d9b3cb775629e82832f6385731be1111"
  },
  {
    "url": "config/index.html",
    "revision": "91048f7f3ef096067682fd77b5376b1b"
  },
  {
    "url": "favicon.png",
    "revision": "d14c965fe422698a3c614b9883b0d687"
  },
  {
    "url": "github.svg",
    "revision": "5a14e36c8b0b5e4ba427f47fca304477"
  },
  {
    "url": "guide/debug.html",
    "revision": "eb9eea1c3af22d7551e761f2ad51e528"
  },
  {
    "url": "guide/index.html",
    "revision": "8dbc1b1615e34c54c03ac7252cb3504e"
  },
  {
    "url": "guide/nodes.html",
    "revision": "57de05f57fc5bd9937883ea9d36aaeb4"
  },
  {
    "url": "guide/sensors.html",
    "revision": "5610c8533bd5d9514a90e8213b2daee1"
  },
  {
    "url": "guide/trigger.html",
    "revision": "5cf5476db635c1abd8e577c5e160e3f2"
  },
  {
    "url": "guide/upcoming.html",
    "revision": "25ec95514245b9a2b443e20dc2f261c4"
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
    "revision": "77695aa947087c6535e3191a38901adf"
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
