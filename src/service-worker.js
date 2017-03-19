import * as app_settings from 'data/app.settings';

const CACHE_NAME_API = 'task-manager-api-v1-' + (new Date()).toISOString();
const CACHE_NAME_APP_SHELL = 'task-manager-app-shell-v1-' + (new Date()).toISOString();

const { assets } = global.serviceWorkerOption;
let _files_to_cache = [
    ...assets,
    '/',
    '/index.html'//,
    // '/service-worker.js'
];

// --------------------------------------------
// install
// --------------------------------------------

self.addEventListener('install', function(e) {

    // console.log('[Service Worker] Install');

    // --------------------------------------------
    // App Shell
    // --------------------------------------------
    // Cache strategy: On install - as a dependency
    // https://jakearchibald.com/2014/offline-cookbook/#on-install-as-a-dependency
    // --------------------------------------------

    e.waitUntil(
        caches.open(CACHE_NAME_APP_SHELL).then(function(cache) {

            // console.log('[Service Worker] Caching App Shell');

            return cache.addAll(_files_to_cache);
        }).catch(function(error) { console.error(error); })
    );
});

// --------------------------------------------
// activate
// --------------------------------------------

self.addEventListener('activate', function(e) {

    // console.log('[Service Worker] Activate');

    // --------------------------------------------
    // Clear old cache
    // --------------------------------------------

    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== CACHE_NAME_APP_SHELL && key !== CACHE_NAME_API) {

                    // console.log('[Service Worker] Removing old cache', key);

                    return caches.delete(key);
                }
            }));
        }).catch(function(error) { console.error(error); })
    );

    // corner case fix
    // NOTES.md "service worker - activate - corner case fix"

    return self.clients.claim();
});

// --------------------------------------------
// fetch
// --------------------------------------------

self.addEventListener('fetch', function(e) {

    // console.log('[Service Worker] Fetch', e.request.url);

    let _api_url = app_settings.DOMAIN;

    // --------------------------------------------
    // API Requests
    // --------------------------------------------
    // Cache strategy: ???
    // --------------------------------------------

    if (e.request.url.indexOf('access_tokens') > -1) {
        // don't intercept access token requests
    }

    else if (e.request.url.indexOf(_api_url) > -1) {

        e.respondWith(
            caches.open(CACHE_NAME_API).then(function(cache) {

                var cache_response;
                var api_response;

                cache.match(e.request.url).then(function(response) {
                    // console.log('[Service Worker] API Request : CACHE MATCH', e.request.url);
                    // console.log(response);
                    if (typeof response !== 'undefined') {
                        response.clone().json().then(
                            (response) => {
                                cache_response = response;
                            },
                            (message) => {
                                console.error(message);
                            }
                        );
                    }
                }).catch(function(error) { console.error(error); });

                return fetch(e.request).then(function(response) {

                    // console.log('[Service Worker] API Request : FETCH RESPONSE');
                    // console.log(response);
                    // console.log('[Service Worker] Caching API response', e.request.url);

                    if (typeof response !== 'undefined' && typeof cache_response !== 'undefined') {
                        response.clone().json().then(
                            (response) => {
                                api_response = response;

                                console.log(JSON.stringify(cache_response) == JSON.stringify(api_response));
                                console.log(JSON.stringify(cache_response) === JSON.stringify(api_response));
                                console.log(cache_response);
                                console.log(api_response);
                            },
                            (message) => {
                                console.error(message);
                            }
                        );
                    }

                    cache.put(e.request.url, response.clone());

                    return response;
                }).catch(function(error) { console.error(error); });
            })
        );
    }

    // --------------------------------------------
    // App Shell file Requests
    // --------------------------------------------
    // Cache strategy: ???
    // --------------------------------------------

    else {

        e.respondWith(
            caches.match(e.request).then(function(response) {

                if (response) {

                    // console.log('[Service Worker] App Shell Request : CACHE');

                    return response;
                }

                // console.log('[Service Worker] App Shell Request : NO CACHE : FETCH');

                return fetch(e.request);
                // return response || fetch(e.request);
            }).catch(function(error) { console.error(error); })
        );
    }
});
