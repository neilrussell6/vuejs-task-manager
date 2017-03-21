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

// data
import { JsonApiModel } from 'data/models/jsonapi.model';
import { Task } from 'data/models/crud/jsonapi/task.model';
import * as TaskActions from 'state/tasks/task.actions';

// store
import { store } from 'state/store';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as constants from './task.constants';

// ==============================================
// local storage
// ==============================================

// --------------------------
// item
// --------------------------

export function destroyTask (task, suppress_server_call = false) {
    return function (dispatch) {

        const _state = store.getState();

        return StorageUtils.validate(task).then(() => {

            const _resource_object = task.resource_object;

            return StorageUtils.destroy(_resource_object.type, task.uuid).then(() => {

                dispatch({
                    type: constants.ACTION_DESTROYED_TASK,
                    task
                });

                // if user is not authenticated
                if (!_state.user.is_authenticated) {
                    return Promise.resolve();
                }

                // destroy on server
                return dispatch(deleteResource(task.resource_identifier_object))
                    .catch((error) => dispatch(api_actions.apiError(error)));

            }).catch((message) => console.error(message));
        }).catch((message) => console.error(message));
    };
}

export function storeOrUpdateTask (task, project) {
    return function (dispatch) {

        return StorageUtils.validate(task).then(() => {

            const _resource_object = task.resource_object;

            return StorageUtils.view(_resource_object.type, task.uuid).then((response) => {

                // is not in storage

                if (typeof response === 'undefined') {
                    return dispatch(storeTask(task, project));
                }

                // is in storage

                return dispatch(updateTask(task, {}));

            }).catch((message) => console.error(message));
        }).catch((message) => console.error(message));
    };
}

export function storeTask (task, project, suppress_server_call = false) {
    return function (dispatch) {

        const _state = store.getState();

        return StorageUtils.validate(task).then(() => {

            const _task = new Task(Object.assign({}, task, { project_uuid: project.uuid, user_uuid: _state.user.uuid }));
            return StorageUtils.store(_task).then((uuid) => {

                dispatch({
                    type: constants.ACTION_STORED_TASK,
                    task: _task
                });

                // if user is not authenticated or server call is suppressed
                if (!_state.user.is_authenticated || suppress_server_call) {
                    return Promise.resolve();
                }

                // store on server
                return dispatch(createResource(_task.resource_object)).then((response) => {

                    // update in local storage with server id
                    return dispatch(updateTask(_task, { server_id: parseInt(response.data.id) }, _state.user, true));

                }).catch((error) => dispatch(api_actions.apiError(error)));


            }).catch((message) => console.error(message));
        }).catch((message) => console.error(message));
    };
}

export function updateTask (task, data = {}, suppress_server_call = false) {
    return function (dispatch) {

        const _state = store.getState();

        Promise.all([ StorageUtils.validate(task), StorageUtils.update(task, data) ]).then((responses) => {

            dispatch({
                type: constants.ACTION_UPDATED_TASK,
                task,
                data
            });

            // if user is not authenticated or server call is suppressed
            if (!_state.user.is_authenticated || suppress_server_call) {
                return Promise.resolve();
            }

            // update on server
            return dispatch(updateResource(task.resource_object))
                .catch((error) => dispatch(api_actions.apiError(error)));

        }).catch((message) => console.error(message));
    };
}

export function toggleTaskComplete (task) {
    return function (dispatch) {
        dispatch(updateTask(task, task.toggleStatusComplete()));
    };
}

export function trashTask (task) {
    return function (dispatch) {
        dispatch(updateTask(task, task.trash()));
    };
}

export function undoTrashTask (task) {
    return function (dispatch) {
        dispatch(updateTask(task, task.undoTrash()));
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

        console.log(project);

        return StorageUtils.indexRelated('tasks', 'project_uuid', project.uuid).then((tasks) => {

            dispatch({
                type: constants.ACTION_INDEXED_TASKS,
                tasks
            });

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

        dispatch(TaskActions.fetchTasks(task));
    };
}
