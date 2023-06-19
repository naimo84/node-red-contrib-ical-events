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
    "revision": "1ee0e3759e9e206885ee4139a72b1c12"
  },
  {
    "url": "assets/css/0.styles.c9d52bfa.css",
    "revision": "e614591d861b652cd0ad15d24b36d40e"
  },
  {
    "url": "assets/img/attach.06a160ec.png",
    "revision": "06a160ec06da8df01ce14d4e4a2c0832"
  },
  {
    "url": "assets/img/launch.json.6b847d72.jpeg",
    "revision": "6b847d72e898b2c842c5b1b3490f2a89"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.a907f20d.js",
    "revision": "b50fe560c370dc43167ce46645ad06a7"
  },
  {
    "url": "assets/js/11.f53e5986.js",
    "revision": "fec0481c57d57d7bdb4487968efd27f1"
  },
  {
    "url": "assets/js/12.6388fe52.js",
    "revision": "22c1a298dd3275bcfb7fee810a69c216"
  },
  {
    "url": "assets/js/3.cacebfcd.js",
    "revision": "2038b01bfb3b2e8aded9b1159f86d282"
  },
  {
    "url": "assets/js/4.0f389d7a.js",
    "revision": "f8c176e7c3415557f73480218491a905"
  },
  {
    "url": "assets/js/5.2a3427d8.js",
    "revision": "87bb9affdfe176d031442fa6dbeea071"
  },
  {
    "url": "assets/js/6.b50e9ddd.js",
    "revision": "71aa34bd10aad4cd94f968c712a303a9"
  },
  {
    "url": "assets/js/7.490d4595.js",
    "revision": "5de6252ec65241b20b08ebc241a50e20"
  },
  {
    "url": "assets/js/8.58499307.js",
    "revision": "2ff9585958dc6ab82e305452c0ac2856"
  },
  {
    "url": "assets/js/9.455a70d7.js",
    "revision": "68afae9ecdc58d0a6dd0e39605b27d7c"
  },
  {
    "url": "assets/js/app.ca10d6ab.js",
    "revision": "39009f2365a85b056f92b6dfd650f1a9"
  },
  {
    "url": "assets/js/vendors~flowchart.db8e65b8.js",
    "revision": "d6704e1487d008958a6f0ecb74c214ed"
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
    "revision": "5313d8f4fc8869731762522861df2781"
  },
  {
    "url": "guide/index.html",
    "revision": "8be7760554feb0725871583b7c538683"
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
    "revision": "784d0bd7517581fa2d6651e93a90c794"
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
