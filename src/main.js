// actions
import * as UserActions from 'state/user/user.actions';
import * as ProjectActions from 'state/projects/project.actions';

// data
import * as app_settings from 'data/app.settings';

// service worker
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

// store
import { store } from 'state/store';
import { setEndpointHost, setEndpointPath, setHeaders } from 'redux-json-api';

// view
import './view/main';

// ----------------------------------------------------------------
// API
// ----------------------------------------------------------------

store.dispatch(setEndpointHost(app_settings.DOMAIN));
store.dispatch(setEndpointPath(app_settings.API_PREFIX));
store.dispatch(setHeaders({
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}));

// // ----------------------------------------------------------------
// // without Service Worker
// // ----------------------------------------------------------------
//
// store.dispatch(UserActions.fetchOrCreateLocalUser()).then((user) => {
//     store.dispatch(ProjectActions.fetchProjects(user));
// })
// .catch((message) => {
//     console.error(message);
// });

// // ----------------------------------------------------------------
// // Service Worker (reference)
// // ----------------------------------------------------------------
//
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//         .register('./service-worker.js')
//         .then(function() {
//             console.log('[Service Worker] Registered');
//         })
//         .catch((message) => {
//             console.error(message);
//         });
// }

// ----------------------------------------------------------------
// Service Worker
// ----------------------------------------------------------------

if ('serviceWorker' in navigator) {

    Promise.all([
        runtime.register(),
        store.dispatch(UserActions.fetchOrCreateLocalUser())
    ]).then((responses) => {

        console.log('[Service Worker] Registered');

        // fetch projects
        const _user = responses[1];
        store.dispatch(ProjectActions.fetchProjects(_user));
    })
    .catch((message) => {
        console.error(message);
    });
}
