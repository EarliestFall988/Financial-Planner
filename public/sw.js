if(!self.define){let e,a={};const i=(i,n)=>(i=new URL(i+".js",n).href,a[i]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=a,document.head.appendChild(e)}else e=i,importScripts(i),a()})).then((()=>{let e=a[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,s)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(a[o])return;let r={};const d=e=>i(e,o),c={module:{uri:o},exports:r,require:d};a[o]=Promise.all(n.map((e=>c[e]||d(e)))).then((e=>(s(...e),r)))}}define(["./workbox-07a7b4f2"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/33-8a0038a421535c82.js",revision:"8a0038a421535c82"},{url:"/_next/static/chunks/664-5aabd22f6a038f18.js",revision:"5aabd22f6a038f18"},{url:"/_next/static/chunks/framework-2a79fe6a091fa1ac.js",revision:"2a79fe6a091fa1ac"},{url:"/_next/static/chunks/main-586e23ca5996d605.js",revision:"586e23ca5996d605"},{url:"/_next/static/chunks/pages/_app-78ae86f0eab8f63d.js",revision:"78ae86f0eab8f63d"},{url:"/_next/static/chunks/pages/_error-b6491f42fb2263bb.js",revision:"b6491f42fb2263bb"},{url:"/_next/static/chunks/pages/finances-d0cb936884c129be.js",revision:"d0cb936884c129be"},{url:"/_next/static/chunks/pages/index-ae0114183c2c4670.js",revision:"ae0114183c2c4670"},{url:"/_next/static/chunks/pages/payables/%5Bid%5D-3829eaa0aeb58f37.js",revision:"3829eaa0aeb58f37"},{url:"/_next/static/chunks/pages/payables/new-f5a88491cc9b5362.js",revision:"f5a88491cc9b5362"},{url:"/_next/static/chunks/pages/receivables/%5Bid%5D-3353a6bf3147c723.js",revision:"3353a6bf3147c723"},{url:"/_next/static/chunks/pages/receivables/new-a7a060b645633ceb.js",revision:"a7a060b645633ceb"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-79ea71e8a2fb0718.js",revision:"79ea71e8a2fb0718"},{url:"/_next/static/css/de0563ae94b54a20.css",revision:"de0563ae94b54a20"},{url:"/_next/static/zOqPhAAIE4O3bk_fF-X0e/_buildManifest.js",revision:"85b83b145d5f866bc1ed184610130671"},{url:"/_next/static/zOqPhAAIE4O3bk_fF-X0e/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/android/android-launchericon-144-144.png",revision:"e3ad5481639599da2ffc6d064e7e979c"},{url:"/android/android-launchericon-192-192.png",revision:"19cd586734706b7eabe18a54f838c774"},{url:"/android/android-launchericon-48-48.png",revision:"8061b525012eadc6e980cde9f148b3e1"},{url:"/android/android-launchericon-512-512.png",revision:"be406f1656ef9fa0ca84e6b5c1bdbdc2"},{url:"/android/android-launchericon-72-72.png",revision:"8688582c4c28cae08e96ffdcc261dd42"},{url:"/android/android-launchericon-96-96.png",revision:"be3ea38fe5e60516fc106deaa54e8db4"},{url:"/favicon.ico",revision:"11f557411fcb34655f6fae5612135d2e"},{url:"/favicon_old.ico",revision:"f3c25005ddbc164f60f31b5aeb413ce5"},{url:"/ios/100.png",revision:"948b3f9acab07788d4780d02b849bc98"},{url:"/ios/1024.png",revision:"1761d6f7e427462c619f45c5700d8125"},{url:"/ios/114.png",revision:"6501afc5e04515258aaf367751008a1a"},{url:"/ios/120.png",revision:"58c206f47b2402cb3cb96462015f00fb"},{url:"/ios/128.png",revision:"1bf14728d53b129dd1d2805c50aeee4f"},{url:"/ios/144.png",revision:"e3ad5481639599da2ffc6d064e7e979c"},{url:"/ios/152.png",revision:"9752de49043201cbf52217f84b305888"},{url:"/ios/16.png",revision:"f9a07f53724a55de4f8a8ab6d0db014d"},{url:"/ios/167.png",revision:"f2592d4654e4124be6f706e8b36f1001"},{url:"/ios/180.png",revision:"a83c3c669c79b05ed0d0ff2ca6817934"},{url:"/ios/192.png",revision:"19cd586734706b7eabe18a54f838c774"},{url:"/ios/20.png",revision:"7b9ecf6fe50db1df72aa4e7ae1b5caf3"},{url:"/ios/256.png",revision:"ece237d0486a3fc2536ed3ba79e5b626"},{url:"/ios/29.png",revision:"49235178dadb2e5134f20a9ed4cb7568"},{url:"/ios/32.png",revision:"b94e3e3c8282b8ed96403a1b7704bc24"},{url:"/ios/40.png",revision:"c1ff08bdd87dea78ed1c3d7f6ae5a777"},{url:"/ios/50.png",revision:"932b7d49672c2d748b961850ea2ab9a5"},{url:"/ios/512.png",revision:"be406f1656ef9fa0ca84e6b5c1bdbdc2"},{url:"/ios/57.png",revision:"03337ada3d5bd5228b3703076d12585f"},{url:"/ios/58.png",revision:"d96e71bca0cf45427c5419f5a1a47a55"},{url:"/ios/60.png",revision:"3d12e905f9a5b949ed2baa651b242a35"},{url:"/ios/64.png",revision:"4e51edc0e7e5fd57ead888fa8d1dc3da"},{url:"/ios/72.png",revision:"8688582c4c28cae08e96ffdcc261dd42"},{url:"/ios/76.png",revision:"c79779ba6fffa59348177f9630fb0d2b"},{url:"/ios/80.png",revision:"443aed1ab412a773a2b16157be21c3e8"},{url:"/ios/87.png",revision:"510c4c71b3c327cc21530dd463e164c9"},{url:"/manifest.json",revision:"9fa6fed07f343f1035f382ce4530982f"},{url:"/pwa/Logo.png",revision:"6bab42a115f1c8382310d72cdb65aebb"},{url:"/windows11/LargeTile.scale-100.png",revision:"bb7584b8a0b0c3a100913fad6032243b"},{url:"/windows11/LargeTile.scale-125.png",revision:"2c22ad4454101a0470c078dcc5642a25"},{url:"/windows11/LargeTile.scale-150.png",revision:"9997fd9e53e88dcd42195c200b5406c6"},{url:"/windows11/LargeTile.scale-200.png",revision:"1dd64d563aa46dd22292057649d5ddf1"},{url:"/windows11/LargeTile.scale-400.png",revision:"23652ba34252eed8e70b39024982b264"},{url:"/windows11/SmallTile.scale-100.png",revision:"153f0c55876be4ee4fec217aa2d6e228"},{url:"/windows11/SmallTile.scale-125.png",revision:"a74ca3ef31b9477eb1c7e64c5095f14e"},{url:"/windows11/SmallTile.scale-150.png",revision:"effb18f81790432287f2e27c9dc83e2c"},{url:"/windows11/SmallTile.scale-200.png",revision:"72adf5748d1fb6ff645c6d6c4d2f7c43"},{url:"/windows11/SmallTile.scale-400.png",revision:"2be6a6ed70bd556ba89a5dbcba92d23d"},{url:"/windows11/SplashScreen.scale-100.png",revision:"33650fb1a5fde4e35c78bb5de2426d83"},{url:"/windows11/SplashScreen.scale-125.png",revision:"0c382663c17e753df44aa3c1a191a10d"},{url:"/windows11/SplashScreen.scale-150.png",revision:"9cac9b2d4d46d7fcd3449179db4c177c"},{url:"/windows11/SplashScreen.scale-200.png",revision:"6b8a88c829356254ccf14a749ab67478"},{url:"/windows11/SplashScreen.scale-400.png",revision:"8e8ce967be3210e78fd3e4366a69f523"},{url:"/windows11/Square150x150Logo.scale-100.png",revision:"6245fb99e25d4db6f20bb2b66f16ca3b"},{url:"/windows11/Square150x150Logo.scale-125.png",revision:"964842f306fce315fbbbdecaa94499a8"},{url:"/windows11/Square150x150Logo.scale-150.png",revision:"73525664a228e2ecf30bfb95db04a450"},{url:"/windows11/Square150x150Logo.scale-200.png",revision:"ebe1dc485b8185805c238dbe69cbadaa"},{url:"/windows11/Square150x150Logo.scale-400.png",revision:"113340463f97c79c113fdb042025b46e"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",revision:"e4d7e8306932ef61422d15c5ad843a06"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",revision:"8304424f587d2e9d2a9040c8a6a691d8"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",revision:"7cd1a40b3490657633c1ef9eb37c00b6"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",revision:"4dfef693f69a2b9c5904d85d29c80611"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",revision:"a6b822c9702851f250aff7a93e1286a7"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",revision:"5d4c9b8f7ab2e4c43e370ffc022404f9"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",revision:"f316f84917bed3fbb43922a19df5df42"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",revision:"9d2d6339a8731f863675219dddf441f1"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",revision:"1da6543a408e799149da77fd23b93d13"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",revision:"8f0c702212fc596c56f226a510627ebe"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",revision:"27bde07b53eec12e54b8c8fd746bb40b"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",revision:"93ca89b0ac9d2cf70b1404e9c5c85d90"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",revision:"3bd1a7e20b30fd8c241c616f44a7383a"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",revision:"9c24e6bf9fbb47ba2ce28dd2c0ede492"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",revision:"f706337f22b6908c215000ba1b594fb6"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",revision:"e4d7e8306932ef61422d15c5ad843a06"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",revision:"8304424f587d2e9d2a9040c8a6a691d8"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",revision:"7cd1a40b3490657633c1ef9eb37c00b6"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",revision:"4dfef693f69a2b9c5904d85d29c80611"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",revision:"a6b822c9702851f250aff7a93e1286a7"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",revision:"5d4c9b8f7ab2e4c43e370ffc022404f9"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",revision:"f316f84917bed3fbb43922a19df5df42"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",revision:"9d2d6339a8731f863675219dddf441f1"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",revision:"1da6543a408e799149da77fd23b93d13"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",revision:"8f0c702212fc596c56f226a510627ebe"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",revision:"27bde07b53eec12e54b8c8fd746bb40b"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",revision:"93ca89b0ac9d2cf70b1404e9c5c85d90"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",revision:"3bd1a7e20b30fd8c241c616f44a7383a"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",revision:"9c24e6bf9fbb47ba2ce28dd2c0ede492"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",revision:"f706337f22b6908c215000ba1b594fb6"},{url:"/windows11/Square44x44Logo.scale-100.png",revision:"1da6543a408e799149da77fd23b93d13"},{url:"/windows11/Square44x44Logo.scale-125.png",revision:"eb39471a7c1645211cee1537d8b4c9d5"},{url:"/windows11/Square44x44Logo.scale-150.png",revision:"9199b6ad522780e5c658173ac30f78f1"},{url:"/windows11/Square44x44Logo.scale-200.png",revision:"a44ba402830408ddd231bab9d0fbb43f"},{url:"/windows11/Square44x44Logo.scale-400.png",revision:"9b454ebe9cac1b130337ec3a56320488"},{url:"/windows11/Square44x44Logo.targetsize-16.png",revision:"e4d7e8306932ef61422d15c5ad843a06"},{url:"/windows11/Square44x44Logo.targetsize-20.png",revision:"8304424f587d2e9d2a9040c8a6a691d8"},{url:"/windows11/Square44x44Logo.targetsize-24.png",revision:"7cd1a40b3490657633c1ef9eb37c00b6"},{url:"/windows11/Square44x44Logo.targetsize-256.png",revision:"4dfef693f69a2b9c5904d85d29c80611"},{url:"/windows11/Square44x44Logo.targetsize-30.png",revision:"a6b822c9702851f250aff7a93e1286a7"},{url:"/windows11/Square44x44Logo.targetsize-32.png",revision:"5d4c9b8f7ab2e4c43e370ffc022404f9"},{url:"/windows11/Square44x44Logo.targetsize-36.png",revision:"f316f84917bed3fbb43922a19df5df42"},{url:"/windows11/Square44x44Logo.targetsize-40.png",revision:"9d2d6339a8731f863675219dddf441f1"},{url:"/windows11/Square44x44Logo.targetsize-44.png",revision:"1da6543a408e799149da77fd23b93d13"},{url:"/windows11/Square44x44Logo.targetsize-48.png",revision:"8f0c702212fc596c56f226a510627ebe"},{url:"/windows11/Square44x44Logo.targetsize-60.png",revision:"27bde07b53eec12e54b8c8fd746bb40b"},{url:"/windows11/Square44x44Logo.targetsize-64.png",revision:"93ca89b0ac9d2cf70b1404e9c5c85d90"},{url:"/windows11/Square44x44Logo.targetsize-72.png",revision:"3bd1a7e20b30fd8c241c616f44a7383a"},{url:"/windows11/Square44x44Logo.targetsize-80.png",revision:"9c24e6bf9fbb47ba2ce28dd2c0ede492"},{url:"/windows11/Square44x44Logo.targetsize-96.png",revision:"f706337f22b6908c215000ba1b594fb6"},{url:"/windows11/StoreLogo.scale-100.png",revision:"932b7d49672c2d748b961850ea2ab9a5"},{url:"/windows11/StoreLogo.scale-125.png",revision:"0e6a2309b31cb36882096e30516a9d9f"},{url:"/windows11/StoreLogo.scale-150.png",revision:"92feca536288fe1f7c49c962b322af40"},{url:"/windows11/StoreLogo.scale-200.png",revision:"948b3f9acab07788d4780d02b849bc98"},{url:"/windows11/StoreLogo.scale-400.png",revision:"88519611b3b213b7843e0f220365905e"},{url:"/windows11/Wide310x150Logo.scale-100.png",revision:"a804dd77fb5b7a3b8f957d71f72e02db"},{url:"/windows11/Wide310x150Logo.scale-125.png",revision:"8ee991f78d5ca52a7bb87c082c861b8e"},{url:"/windows11/Wide310x150Logo.scale-150.png",revision:"a764975393dbbd4f8121106fb46fc32e"},{url:"/windows11/Wide310x150Logo.scale-200.png",revision:"33650fb1a5fde4e35c78bb5de2426d83"},{url:"/windows11/Wide310x150Logo.scale-400.png",revision:"6b8a88c829356254ccf14a749ab67478"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:i,state:n})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));