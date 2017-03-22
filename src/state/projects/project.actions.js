import {
    API_CREATE_FAILED,
    API_DELETE_FAILED,
    API_READ_FAILED,
    API_UPDATE_FAILED,
    createResource,
    deleteResource,
    readEndpoint,
    updateResource
} from 'redux-json-api';

// actions
import * as api_actions from 'state/api.actions';
import * as task_actions from 'state/tasks/task.actions';

// data
import { JsonApiModel } from 'data/models/jsonapi.model';
import { Project } from 'data/models/crud/jsonapi/project.model';

// store
import { store } from 'state/store';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as constants from './project.constants';

// ==============================================
// local storage
// ==============================================

// --------------------------
// item
// --------------------------

export function destroyProject (project, suppress_server_call = false) {
    return function (dispatch) {

        const _state = store.getState();

        return StorageUtils.validate(project).then(() => {

            const _resource_object = project.resource_object;

            // destroy on local storage
            return StorageUtils.destroy(_resource_object.type, project.uuid).then(() => {

                dispatch({
                    type: constants.ACTION_DESTROYED_PROJECT,
                    project
                });

                // if user is not authenticated
                // ... or server call is suppressed
                // ... or app is offline
                if (!_state.user.is_authenticated || suppress_server_call || _state.app.is_offline) {
                    return Promise.resolve();
                }

                // destroy on server
                return dispatch(deleteResource(project.resource_identifier_object))
                    .catch((error) => dispatch(api_actions.apiError(error)));

            }).catch((message) => console.error(message));
        }).catch((message) => console.error(message));
    };
}

export function storeOrUpdateProject (project) {
    return function (dispatch) {

        return StorageUtils.validate(project).then(() => {

            const _resource_object = project.resource_object;

            return StorageUtils.view(_resource_object.type, project.uuid).then((response) => {

                // is not in storage

                if (typeof response === 'undefined') {
                    return dispatch(storeProject(project));
                }

                // is in storage

                return dispatch(updateProject(project, {}));

            }).catch((message) => console.error(message));
        }).catch((message) => console.error(message));
    };
}

export function storeProject (project, suppress_server_call = false) {
    return function (dispatch) {

        const _state = store.getState();

        return StorageUtils.validate(project).then(() => {

            // store in local storage
            const _project = new Project(Object.assign({}, project, { user_uuid: _state.user.uuid }));
            return StorageUtils.store(_project).then((uuid) => {

                dispatch({
                    type: constants.ACTION_STORED_PROJECT,
                    project: _project
                });

                // if user is not authenticated
                // ... or server call is suppressed
                // ... or app is offline
                if (!_state.user.is_authenticated || suppress_server_call || _state.app.is_offline) {
                    return Promise.resolve();
                }

                // store on server
                return dispatch(createResource(_project.resource_object)).then((response) => {

                    // update in local storage with server id
                    return dispatch(updateProject(_project, { server_id: parseInt(response.data.id) }, _state.user, true)).then((response) => {

                        // select project
                        dispatch(selectProject(_project));

                        return Promise.resolve(_project);

                    }).catch((message) => console.error(message));

                }).catch((error) => dispatch(api_actions.apiError(error)));

            }).catch((message) => console.error(message));
        }).catch((message) => console.error(message));
    };
}

export function updateProject (project, data = {}, suppress_server_call = false) {
    return function (dispatch) {

        const _state = store.getState();

        // update in local storage
        return Promise.all([ StorageUtils.validate(project), StorageUtils.update(project, data) ]).then((uuid) => {

            dispatch({
                type: constants.ACTION_UPDATED_PROJECT,
                project,
                data
            });

            // if user is not authenticated
            // ... or server call is suppressed
            // ... or app is offline
            if (!_state.user.is_authenticated || suppress_server_call || _state.app.is_offline) {
                return Promise.resolve();
            }

            // update on server
            return dispatch(updateResource(project.resource_object))
                .catch((error) => dispatch(api_actions.apiError(error)));

        }).catch((message) => console.error(message));
    };
}

// --------------------------
// collection
// --------------------------

export function refreshProjects () {
    return indexProjects();
}

export function indexProjects (suppress_server_call = false) {
    return function (dispatch) {

        const _state = store.getState();

        // index from local storage
        return StorageUtils.index('projects').then ((projects) => {

            dispatch({
                type: constants.ACTION_INDEXED_PROJECTS,
                projects
            });

            // if user is not authenticated
            // ... or server call is suppressed
            // ... or app is offline
            if (!_state.user.is_authenticated || suppress_server_call || _state.app.is_offline) {
                return Promise.resolve();
            }

            // index from server
            const _endpoint = `users/${_state.user.server_id}/projects`;
            dispatch(readEndpoint(_endpoint)).then((response) => {

                dispatch({
                    type: constants.ACTION_SERVER_INDEXED_PROJECTS,
                    data: response.data
                });

                const _state = store.getState();

                console.log(_state.projects);
                
                // // update or store many in local storage
                // const _data = response.data.map((item) => {
                //     return new Project(Object.assign({}, item.attributes, {
                //         server_id: item.id,
                //         uuid: StorageUtils.makeUUID(),
                //         user_uuid: _state.user.uuid
                //     }));
                // });
                //
                // return StorageUtils.storeMany(_data).then((projects) => {
                //     console.log(projects);
                // });

            }).catch((error) => dispatch(api_actions.apiError(error)));

        }).catch((message) => console.error(message));
    };
}

// ==============================================
// state
// ==============================================

// --------------------------
// item
// --------------------------

export function deselectProject () {
    return {
        type:    constants.ACTION_DESELECT_PROJECT
    };
}

export function makeProject (data = {}) {
    return {
        type: constants.ACTION_MAKE_PROJECT,
        data
    };
}

export function removeProject (uuid) {
    return {
        type: constants.ACTION_REMOVE_PROJECT,
        uuid
    };
}

export function selectProject (project) {
    return function (dispatch) {

        dispatch({
            type:   constants.ACTION_SELECT_PROJECT,
            data:   project
        });

        dispatch(task_actions.indexTasks(project));
    };
}
