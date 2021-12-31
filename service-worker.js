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
    "revision": "a044b7d6b5f16c62000c464fab74b529"
  },
  {
    "url": "assets/css/0.styles.c9d52bfa.css",
    "revision": "e614591d861b652cd0ad15d24b36d40e"
  },
  {
    "url": "assets/img/nodered-palette-manager.5d6bafe3.png",
    "revision": "5d6bafe3923dedf761e5faab20cc80e0"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.cacc52ed.js",
    "revision": "61dddf8a5265a4a86148d8381a6f7c85"
  },
  {
    "url": "assets/js/11.73c5b210.js",
    "revision": "1cf53fd03e7867885a41b5fc0848b915"
  },
  {
    "url": "assets/js/12.cac02ebe.js",
    "revision": "23bd1803dcc58e3762df623c38e6b7dc"
  },
  {
    "url": "assets/js/13.1e82e629.js",
    "revision": "ed3b781823151478801994d5cf90ebbf"
  },
  {
    "url": "assets/js/14.db8e747a.js",
    "revision": "03f272e0d7fbe4a7c8d89f61767d8050"
  },
  {
    "url": "assets/js/15.2b6e3988.js",
    "revision": "69dd6f8f548b08c1bc1d0e50927ccfa5"
  },
  {
    "url": "assets/js/16.8012a4e0.js",
    "revision": "5e2759ac1bf687a15aa767139965935d"
  },
  {
    "url": "assets/js/17.30259829.js",
    "revision": "b1e7389e2592d7b65a2a51a204f1b22c"
  },
  {
    "url": "assets/js/3.6902006a.js",
    "revision": "9b0b9cd83e438f66ecaac898641b09d2"
  },
  {
    "url": "assets/js/4.44163254.js",
    "revision": "17e16b747893be48bf45e44c8a190b24"
  },
  {
    "url": "assets/js/5.b0a1f306.js",
    "revision": "d138de6dd6e5834febccdb60696c8dec"
  },
  {
    "url": "assets/js/6.209c4215.js",
    "revision": "51c652ee6e0347b6ffdac9727cf7f151"
  },
  {
    "url": "assets/js/7.4495dce7.js",
    "revision": "3f7f5cec10fed881881f0d59943d75c8"
  },
  {
    "url": "assets/js/8.e595f7a8.js",
    "revision": "9e69c721262fc4d5f3a68df0f819190b"
  },
  {
    "url": "assets/js/9.b8be7a6b.js",
    "revision": "ad6f4fd5d8ad135e7662f83ce28dc82c"
  },
  {
    "url": "assets/js/app.db5b304e.js",
    "revision": "4600fb82583f2d3642598266ad728d8a"
  },
  {
    "url": "assets/js/vendors~flowchart.88b6c7aa.js",
    "revision": "6ec9428eb169bb0b962842f81cc7a3f7"
  },
  {
    "url": "config/index.html",
    "revision": "92708ebae4319936c32e5a54c4754d2c"
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
    "revision": "265062687d491365295954f2b55911d5"
  },
  {
    "url": "guide/index.html",
    "revision": "2352b78608f0da742d2008153fc4b79f"
  },
  {
    "url": "guide/nodes.html",
    "revision": "17b6a9e23cb1c10c633777f83e4cd5ab"
  },
  {
    "url": "guide/sensors.html",
    "revision": "794830a54de29412bdcecfa4f319b5c8"
  },
  {
    "url": "guide/trigger.html",
    "revision": "9b2363622befef9e715de9c897b72a40"
  },
  {
    "url": "guide/upcoming.html",
    "revision": "60f4605a607073e8306f6973ce175db6"
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
    "revision": "a461b5c5bddd8ae3cf6dbb562e7cafc9"
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
