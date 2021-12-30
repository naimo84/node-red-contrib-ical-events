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
    "revision": "bf998517695e58745926fa809a00b4a2"
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
    "url": "assets/js/15.1701c424.js",
    "revision": "8f339910e3c3fa3c9e76e7df59c39b87"
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
    "url": "assets/js/app.ea139ece.js",
    "revision": "f893867e9e041d381bd4285ef7b13ea3"
  },
  {
    "url": "assets/js/vendors~flowchart.171a5f9d.js",
    "revision": "d9b3cb775629e82832f6385731be1111"
  },
  {
    "url": "config/index.html",
    "revision": "3037051190e07b1bced9edf37a47005a"
  },
  {
    "url": "favicon.png",
    "revision": "3bafa54ce075d3f5efd9bad5ed734fdb"
  },
  {
    "url": "github.svg",
    "revision": "5a14e36c8b0b5e4ba427f47fca304477"
  },
  {
    "url": "guide/debug.html",
    "revision": "d97da947d4f55ed77114f6fb3333b2f7"
  },
  {
    "url": "guide/index.html",
    "revision": "9b43e422d5de6d94391b73bffd3055bd"
  },
  {
    "url": "guide/nodes.html",
    "revision": "0f4da23f84d26d048b700389806b0130"
  },
  {
    "url": "guide/sensors.html",
    "revision": "d68efba43e42bb4eb9a619c602b2caf8"
  },
  {
    "url": "guide/trigger.html",
    "revision": "fc4f753f4cff0ee74d641986427b675d"
  },
  {
    "url": "guide/upcoming.html",
    "revision": "4e3a2f4266c76efa3237ba162b4f002d"
  },
  {
    "url": "icons/android-chrome-192x192.png",
    "revision": "d11db6a43debb45ba0d20e8c8f3a284f"
  },
  {
    "url": "icons/android-chrome-512x512.png",
    "revision": "071599deccb807ff8f9d38deaaadc36e"
  },
  {
    "url": "icons/apple-touch-icon-120x120.png",
    "revision": "44ceae857825d1f345891eab3cbaf83e"
  },
  {
    "url": "icons/apple-touch-icon-152x152.png",
    "revision": "b367b1caa953e3a6ff06d3c018a3f6b3"
  },
  {
    "url": "icons/apple-touch-icon-180x180.png",
    "revision": "7444d6986e036c065287a839928d05f3"
  },
  {
    "url": "icons/apple-touch-icon-60x60.png",
    "revision": "938b7681af2299b0ac47af9b7f2759db"
  },
  {
    "url": "icons/apple-touch-icon-76x76.png",
    "revision": "92ded4dd7ddc347f05535ddeea343220"
  },
  {
    "url": "icons/apple-touch-icon.png",
    "revision": "7444d6986e036c065287a839928d05f3"
  },
  {
    "url": "icons/favicon-16x16.png",
    "revision": "cf4b7492f6e85fd8de4c76de2971ef8c"
  },
  {
    "url": "icons/favicon-32x32.png",
    "revision": "bb9c62ab93da02a9488963b2d7dc0f0b"
  },
  {
    "url": "icons/msapplication-icon-144x144.png",
    "revision": "bf6d6fd10a317810158361ecfd363f2c"
  },
  {
    "url": "icons/mstile-150x150.png",
    "revision": "866e357ba94d906be308e45d05b5e99e"
  },
  {
    "url": "index.html",
    "revision": "054cae1eeeb71743e4ccab1b161b9b1c"
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
