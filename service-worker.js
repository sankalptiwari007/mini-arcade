const CACHE="mini-arcade-v7-v1";
const CORE=["./","./index.html","./style.css","./app.js","./game-registry.js","./storage.js","./progression.js","./achievements.js","./challenges.js","./audio.js","./graphics.js","./input.js","./utils.js","./manifest.json"];
const GAMES=["arrow-escape","fps-target","highway","space-shooter","snake","pong","breakout","2048","memory","reaction","color-rush","tictactoe","basketball","cricket","clicker","dodge-meteors","brick-stack","flappy-arcade","lightning-tap","number-rush","maze-runner","word-scramble","tower-defense","target-pop","balance-ball"].map(x=>"./games/"+x+".js");
const ALL=CORE.concat(GAMES);
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ALL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url), isAppShell=url.origin===location.origin && (e.request.mode==="navigate" || CORE.some(p=>new URL(p,location.href).pathname===url.pathname));
  if(isAppShell){e.respondWith(fetch(e.request,{cache:"no-store"}).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));return;}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>caches.match("./index.html"))));
});
