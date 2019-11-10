const offlineCache="offline-cache-v1"
function precache_offline(items){caches.open(offlineCache).then(cache=>{cache.addAll(items).then(()=>console.info("[Offline Cacher] cached routes",items));})}
function cache_for_route(route){fetch(route+'index.json').then((response)=>response.json()).then((response)=>{console.info("[Offline Cacher] received cache manifest",response);precache_offline(response.precache);})}
if(window.location.pathname=='/'){cache_for_route('/');}