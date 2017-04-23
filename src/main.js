// actions
import * as user_actions from 'state/user/user.actions';
import * as project_actions from 'state/projects/project.actions';

// data
import * as app_settings from 'data/app.settings';

// service worker
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

// store
import { store } from 'state/store';
import { setEndpointHost, setEndpointPath, setHeaders } from 'redux-json-api';

// view
import './view/main';

// local
const USE_SERVICE_WORKER = false;

// ----------------------------------------------------------------
// API
// ----------------------------------------------------------------

store.dispatch(setEndpointHost(app_settings.DOMAIN));
store.dispatch(setEndpointPath(app_settings.API_PREFIX));
store.dispatch(setHeaders({
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}));

if (!USE_SERVICE_WORKER) {

    // ----------------------------------------------------------------
    // without Service Worker
    // ----------------------------------------------------------------

    store.dispatch(user_actions.viewOrStoreUser()).then(() => {
        store.dispatch(project_actions.indexProjects());
    }).catch((message) => console.error(message));

} else {

    // // ----------------------------------------------------------------
    // // Service Worker (reference)
    // // ----------------------------------------------------------------
    //
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker
    //         .register('./service-worker.js')
    //         .then(() => console.log('[Service Worker] Registered'))
    //         .catch((message) => console.error(message));
    // }

    // ----------------------------------------------------------------
    // Service Worker
    // ----------------------------------------------------------------

    if ('serviceWorker' in navigator) {

        Promise.all([
            runtime.register(),
            store.dispatch(user_actions.viewOrStoreUser())
        ]).then((responses) => {

            console.log('[Service Worker] Registered');

            // index projects
            store.dispatch(project_actions.indexProjects());
        })
        .catch((message) => console.error(message));
    }
}
