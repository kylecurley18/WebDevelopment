//ParkQuest
function log(...data) {
  console.log("SWv1.0", ...data);
}

log("SW Script executing - adding event listeners");

const STATIC_CACHE_NAME = 'ParkQuest-static-v0';

self.addEventListener('install', event => {
  log('install', event);

  // As soon as this method returns, the service worker is considered installed
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll([
        //'/offline',
        //CSS
        '/css/addStyle.css',
        '/css/communityStyle.css',
        '/css/historyStyle.css',
        '/css/homeStyle.css',
        '/css/indexStyle.css',
        '/css/logReg.css',
        '/css/profile.css',
        '/css/socialStyle.css',
        //'/css/offline.css',

        //Images
        '/css/background-image.jpg',
        //Scripts
        '/js/addFriends.js',
        '/js/APIClient.js',
        '/js/common.js',
        '/js/community.js',
        '/js/HTTPClient.js',
        '/js/login.js',
        '/js/park.js',
        '/js/profile.js',
        '/js/progress.js',
        '/js/register.js',
        '/js/script.js',
        '/js/social.js',
        //External Resources

      ]);
    })
  );
});

self.addEventListener('activate', event => {
  log('activate', event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('ParkQuest-') && cacheName != STATIC_CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);
  //Treat API calls (to our API) differently
  if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
    //If we are here, we are intercepting a call to our API
    if(event.request.method === "GET") {
      //Only intercept (and cache) GET API requests
      event.respondWith(
        networkFirst(event.request)
      );
    }
  }
  else {
    //If we are here, this was not a call to our API
    event.respondWith(
      networkFirst(event.request)
    );
  }

});


function cacheFirst(request) {
  return caches.match(request)
  .then(response => {
    //Return a response if we have one cached. Otherwise, get from the network
    return response || fetchAndCache(request);
  })
  .catch(error => {
    return caches.match('/offline');
  })
}

function networkFirst(request) {
  return fetchAndCache(request)
  .catch(error => {
    //If we get an error, try to return from cache
    return caches.match(request);
  })
  .catch(error => {
    return caches.match('/offline');
  })
}

function fetchAndCache(request) {
  return fetch(request).then(response => {
    var requestUrl = new URL(request.url);
    //Cache successful GET requests that are not browser extensions
    if(response.ok && request.method === "GET" && !requestUrl.protocol.startsWith('chrome-extension')) {
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        cache.put(request, response);
      });
    }
    return response.clone();
  });
}



self.addEventListener('message', event => {
  log('message', event.data);
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
