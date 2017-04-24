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

// data
import { JsonApiModel } from 'data/models/jsonapi.model';
import { Task } from 'data/models/crud/jsonapi/task.model';
import * as task_actions from 'state/tasks/task.actions';

// store
import { store } from 'state/store';
import * as storage_constants from 'state/storage/storage.constants';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as constants from './task.constants';

// ==============================================
// local storage & server
// ==============================================

// --------------------------
// item
// --------------------------

export function toggleTaskComplete (task) {
    return function (dispatch) {
        dispatch(storage_actions.update(task, task.toggleStatusComplete()));
    };
}

export function trashTask (task) {
    return function (dispatch) {
        dispatch(storage_actions.update(task, task.trash()));
    };
}

export function undoTrashTask (task) {
    return function (dispatch) {
        dispatch(storage_actions.update(task, task.undoTrash()));
    };
}

// --------------------------
// collection
// --------------------------

export function refreshTasks (project) {
    return indexTasks(project);
}

export function indexTasks (project) {
    return function (dispatch) {

        let _state = store.getState();

        // index from local storage
        StorageUtils.indexRelated('tasks', 'project_uuid', project.uuid).then((tasks) => {

            dispatch({
                type: storage_constants.ACTION_STORAGE_LOCAL_INDEXED,
                resource_type: 'tasks',
                resources: tasks
            });

            // if user is not authenticated
            // ... or app is offline
            if (!_state.user.is_authenticated || _state.app.is_offline) {
                return;
            }

            // index from server
            const _endpoint = `projects/${project.server_id}/tasks`;
            dispatch(readEndpoint(_endpoint)).then((response) => {

                let _state = store.getState();

                dispatch({
                    type: storage_constants.ACTION_STORAGE_SERVER_INDEXED,
                    resource_type: 'tasks',
                    resources: response.data,
                    related: {
                        user: _state.user,
                        project
                    }
                });

                _state = store.getState();

                StorageUtils.updateOrStoreMany(_state.tasks);

            }).catch((error) => dispatch(storage_actions.serverError(error)));
        }).catch((message) => console.error(message));
    };
}

// ==============================================
// state
// ==============================================

// --------------------------
// text filter
// --------------------------

export function resetTextFilter () {
    return {
        type:     constants.ACTION_RESET_TEXT_FILTER
    };
}

export function setTextFilter (value) {
    return {
        type:     constants.ACTION_SET_TEXT_FILTER,
        value:    value
    };
}

// --------------------------
// complete filter
// --------------------------

export function resetStatusFilter () {
    return {
        type:     constants.ACTION_RESET_COMPLETE_FILTER
    };
}

export function setStatusFilter (value) {
    return {
        type:     constants.ACTION_SET_COMPLETE_FILTER,
        value:    value
    };
}

// --------------------------
// item
// --------------------------

export function deselectTask () {
    return {
        type:    constants.ACTION_DESELECT_TASK
    };
}

export function makeTask (data = {}) {
    return {
        type: constants.ACTION_MAKE_TASK,
        data
    };
}

export function removeTask (uuid) {
    return {
        type: constants.ACTION_REMOVE_TASK,
        uuid
    };
}

export function selectTask (task) {
    return function (dispatch) {

        dispatch({
            type:   constants.ACTION_SELECT_TASK,
            data:   task
        });

        dispatch(task_actions.fetchTasks(task));
    };
}
