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

// actions
import * as storage_actions from 'state/storage/storage.actions';
import * as task_actions from 'state/tasks/task.actions';

// data
import { JsonApiModel } from 'data/models/jsonapi.model';
import { Project } from 'data/models/crud/jsonapi/project.model';

// state
import { store } from 'state/store';
import * as storage_constants from 'state/storage/storage.constants';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as constants from './project.constants';

// ==============================================
// local storage & server
// ==============================================

// --------------------------
// collection
// --------------------------

export function refreshProjects () {
    return indexProjects();
}

export function indexProjects () {
    return function (dispatch) {
        return new Promise((resolve, reject) => {

            let _state = store.getState();

            // index from local storage
            StorageUtils.index('projects').then((projects) => {

                dispatch({
                    type: storage_constants.ACTION_STORAGE_LOCAL_INDEXED,
                    resource_type: 'projects',
                    resources: projects
                });

                // if user is not authenticated
                // ... or app is offline
                if (!_state.user.is_authenticated || _state.app.is_offline) {
                    return resolve();
                }

                // index from server
                const _endpoint = `users/${_state.user.server_id}/projects`;
                dispatch(readEndpoint(_endpoint)).then((response) => {

                    let _state = store.getState();

                    dispatch({
                        type: storage_constants.ACTION_STORAGE_SERVER_INDEXED,
                        resource_type: 'projects',
                        resources: response.data,
                        related: {
                            user: _state.user
                        }
                    });

                    _state = store.getState();

                    StorageUtils.updateOrStoreMany(_state.projects).then((uuids) => {
                        resolve(uuids);
                    });

                }).catch((error) => dispatch(storage_actions.serverError(error)));
            }).catch((message) => console.error(message));
        });
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
            type: constants.ACTION_SELECT_PROJECT,
            resource: project
        });

        dispatch(task_actions.indexTasks(project));
    };
}
