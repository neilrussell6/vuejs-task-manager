import {
    STORAGE_CREATE_FAILED,
    STORAGE_DELETE_FAILED,
    STORAGE_READ_FAILED,
    STORAGE_UPDATE_FAILED,
    createResource,
    deleteResource,
    readEndpoint,
    updateResource
} from 'redux-json-api';

// data
import { Project } from 'data/models/crud/jsonapi/project.model';
import { Task } from 'data/models/crud/jsonapi/task.model';
import { Request, REQUEST_KEY } from 'data/models/basic/request.model';

// store
import { store as _store } from 'state/store';

// state
import * as request_queue_actions from 'state/server-request-queue/server-request-queue.actions';
import * as project_actions from 'state/projects/project.actions';
import * as user_constants from 'state/user/user.constants';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';
import * as JsonApiUtils from 'utils/json-api/json-api.utils';

// local
import * as constants from './storage.constants';

// ==============================================
// CRUD : local storage & server
// ==============================================

// --------------------------
// item
// --------------------------

export function destroy (resource) {
    return function (dispatch) {

        // destroy in local storage
        return dispatch(destroyLocal(resource)).then((response) => {

            const _state = _store.getState();

            // if user is not authenticated
            if (!_state.user.is_authenticated) {
                return Promise.resolve();
            }

            // destroy on server
            return dispatch(destroyServer(resource));
        });
    };
}

export function storeOrUpdate (resource, relationships = {}) {
    return function (dispatch) {

        // if indexedDB is not supported
        if (!indexedDB) {
            return Promise.reject(StorageUtils.ERROR_MESSAGE_UNSUPPORTED_INDEXED_DB);
        }

        // validate resource
        if (!StorageUtils.isResourceValid(resource)) {
            return Promise.reject(StorageUtils.ERROR_MESSAGE_INVALID_MODEL);
        }

        return StorageUtils.view(resource.type, resource.uuid).then((response) => {

            // is not in storage
            // .. so store
            if (typeof response === 'undefined') {
                return dispatch(store(resource, relationships));
            }

            // is in storage
            // .. so update
            return dispatch(update(resource));
        });
    };
}

export function store (resource, relationships = {}) {
    return function (dispatch) {

        // store in local storage
        return dispatch(storeLocal(resource, relationships)).then((response) => {

            const _state = _store.getState();

            // if user is not authenticated
            if (!_state.user.is_authenticated) {
                return Promise.resolve();
            }

            // if app is offline
            if (_state.app.is_offline) {

                // enqueue request
                const _request = new Request({
                    key: REQUEST_KEY.REQUEST_STORE,
                    args: [ resource, relationships ]
                });
                dispatch(request_queue_actions.enqueueRequest(_request));

                return Promise.resolve();
            }

            // store on server
            return dispatch(storeServer(resource, relationships));
        });
    };
}

export function update (resource, data = {}) {
    return function (dispatch) {

        // update in local storage
        return dispatch(updateLocal(resource, data)).then((response) => {

            const _state = _store.getState();

            // if user is not authenticated
            if (!_state.user.is_authenticated) {
                return Promise.resolve();
            }

            // if app is offline
            if (_state.app.is_offline) {

                // enqueue request
                const _request = new Request({
                    key: REQUEST_KEY.REQUEST_STORE,
                    args: [ resource, relationships ]
                });
                dispatch(request_queue_actions.enqueueRequest(_request));

                return Promise.resolve();
            }

            // update on server
            return dispatch(updateServer(resource, data));
        });
    };
}

// ==============================================
// CRUD : local storage
// ==============================================

// --------------------------
// item
// --------------------------

export function destroyLocal (resource) {
    return function (dispatch) {

        // if indexedDB is not supported
        if (!indexedDB) {
            return Promise.reject(StorageUtils.ERROR_MESSAGE_UNSUPPORTED_INDEXED_DB);
        }

        // validate resource
        if (!StorageUtils.isResourceValid(resource)) {
            return Promise.reject(StorageUtils.ERROR_MESSAGE_INVALID_MODEL);
        }

        // destroy on local storage
        return StorageUtils.destroy(resource.type, resource.uuid).then(() => {

            dispatch({
                type: constants.ACTION_STORAGE_LOCAL_DESTROYED,
                resource_type: resource.type,
                resource
            });

            return Promise.resolve();
        });
    };
}

export function storeLocal (resource, relationships = {}) {
    return function (dispatch) {

        // if indexedDB is not supported
        if (!indexedDB) {
            return Promise.reject(StorageUtils.ERROR_MESSAGE_UNSUPPORTED_INDEXED_DB);
        }

        // validate resource
        if (!StorageUtils.isResourceValid(resource)) {
            return Promise.reject(StorageUtils.ERROR_MESSAGE_INVALID_MODEL);
        }

        const _uuids = Object.keys(relationships).length > 0 ? resource.makeRelatedUuids(relationships) : {};

        // store in local storage
        const _resource = new resource.constructor(Object.assign({}, resource, _uuids, { is_new: false }));

        return StorageUtils.store(_resource).then((uuid) => {

            dispatch({
                type: constants.ACTION_STORAGE_LOCAL_STORED,
                resource_type: _resource.type,
                resource: _resource
            });

            return Promise.resolve();
        });
    };
}

export function updateLocal (resource, data = {}) {
    return function (dispatch) {

        // if indexedDB is not supported
        if (!indexedDB) {
            return Promise.reject(StorageUtils.ERROR_MESSAGE_UNSUPPORTED_INDEXED_DB);
        }

        // validate resource
        if (!StorageUtils.isResourceValid(resource)) {
            return Promise.reject(StorageUtils.ERROR_MESSAGE_INVALID_MODEL);
        }

        const _data = Object.assign({}, data, { is_new: false });

        // update in local storage
        return StorageUtils.update(resource, _data).then((uuid) => {

            dispatch({
                type: constants.ACTION_STORAGE_LOCAL_UPDATED,
                resource_type: resource.type,
                resource,
                data
            });

            return Promise.resolve();
        });
    };
}

// ==============================================
// CRUD : server
// ==============================================

// --------------------------
// item
// --------------------------

export function destroyServer (resource) {
   return function (dispatch) {

       const _resource_identifier_object = JsonApiUtils.makeResourceIdentifierObject(resource);
       const _state = _store.getState();
       const _request = new Request({
           key: REQUEST_KEY.REQUEST_DESTROY,
           args: [ _resource_identifier_object ]
       });

       if (_state.app.is_offline) {

           // enqueue request
           dispatch(request_queue_actions.enqueueRequest(_request));

           return Promise.resolve();
       }

       // destroy on server

       return dispatch(deleteResource(_resource_identifier_object)).then(() => {

           dispatch({
               type: constants.ACTION_STORAGE_SERVER_DESTROYED,
               resource_type: resource.type,
               resource
           });

           return Promise.resolve();

       }).catch((error) => {

           // enqueue request
           dispatch(request_queue_actions.enqueueRequest(_request));

           dispatch(serverError(error));
       });
   };
}

export function storeServer (resource, relationships = {}) {
    return function (dispatch) {

        // TODO: temp to check if this is an issue
        if (resource.server_id !== null) {
            console.error("Attempted to store a resource that is already stored");
            return Promise.resolve();
        }

        const _resource_object = JsonApiUtils.makeResourceObject(resource, relationships);
        const _state = _store.getState();
        const _request = new Request({
            key: REQUEST_KEY.REQUEST_STORE,
            args: [ _resource_object ]
        });

        if (_state.app.is_offline) {

            // enqueue request
            dispatch(request_queue_actions.enqueueRequest(_request));

            return Promise.resolve();
        }

        // store on server

        return dispatch(createResource(_resource_object)).then((response) => {

            // update in local storage (with server id)

            return dispatch(updateLocal(resource, { server_id: parseInt(response.data.id) }, _state.user, true)).then((response) => {

                dispatch({
                    type: constants.ACTION_STORAGE_SERVER_STORED,
                    resource_type: resource.type,
                    resource: resource
                });

                return Promise.resolve();
            });

        }).catch((error) => {

            // enqueue request
            dispatch(request_queue_actions.enqueueRequest(_request));

            dispatch(serverError(error));
        });
    };
}

export function updateServer (resource, data = {}) {
    return function (dispatch) {

        // TODO: temp to check if this is an issue
        if (resource.server_id === null) {
            console.error("Attempted to update a resource that is not yet stored");
            return Promise.resolve();
        }

        const _resource = new resource.constructor(Object.assign({}, resource, data));
        const _resource_object = JsonApiUtils.makeResourceObject(_resource);
        const _state = _store.getState();
        const _request = new Request({
            key: REQUEST_KEY.REQUEST_UPDATE,
            args: [ _resource_object ]
        });

        if (_state.app.is_offline) {

            // enqueue request
            dispatch(request_queue_actions.enqueueRequest(_request));

            return Promise.resolve();
        }

        // update on server

        return dispatch(updateResource(_resource_object)).then((response) => {

            dispatch({
                type: constants.ACTION_STORAGE_SERVER_UPDATED,
                resource_type: resource.type,
                resource,
                data
            });

            return Promise.resolve();

        }).catch((error) => {

            // enqueue request
            dispatch(request_queue_actions.enqueueRequest(_request));

            dispatch(serverError(error));
        });
    };
}

// ==============================================
// ERROR : server
// ==============================================

export function serverError (error) {
    return function (dispatch) {

        if (typeof error.response === 'undefined') {

            // connection error
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                return dispatch({ type: constants.ACTION_STORAGE_ERROR_CONNECTION });
            }

            // unknown local error
            // ... so console log
            console.error(error);
            return Promise.resolve(error);
        }

        return error.response.json().then((response) => {

            // 400 range server error
            if (response.hasOwnProperty('errors') && response.errors.length > 0 && response.errors[0].status >= 400 && response.errors[0].status < 500) {

                if (response.errors[0].status === 401 && /expired/g.test(response.errors[0].detail)) {

                    return dispatch({
                       type: user_constants.ACTION_TOKEN_EXPIRED,
                       error: response.errors[0]
                   });
                }

                // expired

                return dispatch({
                    type: constants.ACTION_STORAGE_ERROR_BAD_REQUEST,
                    error: response.errors[0]
                });
            }

            // unknown server error
            dispatch({ type: constants.ACTION_STORAGE_ERROR_UNKNOWN });

            return Promise.resolve();

        }).catch(() => {

            // 500 range server error
            const _status = parseInt(error.response.status);
            if (_status >= 500 && _status < 600) {
                return dispatch({ type: constants.ACTION_STORAGE_ERROR_STORAGE_SERVER_INTERNAL });
            }

            // unknown server error
            dispatch({ type: constants.ACTION_STORAGE_ERROR_UNKNOWN });

            return Promise.resolve();
        });
    };
}

// ==============================================
// SYNC : server
// ==============================================

// export function serverSync () {
//     return function (dispatch) {
//         return new Promise((resolve, reject) => {
//
//             console.log("storage.actions.serverSync");
//
//             // process request queue
//             dispatch(request_queue_actions.processQueue()).then((response) => {
//
//                 const _state = _store.getState();
//
//                 dispatch({ type: constants.ACTION_STORAGE_WILL_SYNC });
//
//                 // projects
//                 // ... index from local storage
//                 StorageUtils.index('projects').then((local_projects) => {
//
//                     console.log("storage.actions.serverSync ::: get local projects");
//                     console.log(local_projects);
//
//                     // projects
//                     // ... store or update
//                     Promise.all([
//                         ...local_projects.map((item) => {
//                             const _relationships = { 'owner': _state.user };
//                             return dispatch(storeOrUpdateServer(new Project(item), _relationships));
//                         }),
//                         dispatch(project_actions.indexProjects())
//                     ]).then((responses) => {
//
//                         const _state = _store.getState();
//
//                         // tasks
//                         // ... index from local storage
//                         StorageUtils.index('tasks').then((local_tasks) => {
//
//                             const _project_uuid_map = _state.projects.reduce((result, item) => {
//                                 return Object.assign({}, result, { [ item.uuid ]: item });
//                             }, {});
//
//                             // tasks
//                             // ... store or update
//                             Promise.all(
//                                 local_tasks.map((item) => {
//                                     const _relationships = {
//                                         'project': _project_uuid_map[ item.project_uuid ],
//                                         'owner': _state.user
//                                     };
//                                     return dispatch(storeOrUpdateServer(new Task(item), _relationships));
//                                 })
//
//                             ).then((responses) => {
//
//                                 dispatch({ type: constants.ACTION_STORAGE_SYNCED });
//                                 resolve();
//
//                             }).catch(message => reject(message));
//                         }).catch(message => reject(message));
//                     }).catch(message => reject(message));
//                 });
//             }).catch(message => reject(message));
//         });
//     };
// }
