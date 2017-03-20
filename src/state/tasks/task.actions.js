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

// data
import { JsonApiModel } from 'data/models/jsonapi.model';
import { Task } from 'data/models/crud/jsonapi/task.model';
import * as TaskActions from 'state/tasks/task.actions';

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

export function destroyTask (task) {
    return function (dispatch) {

        return StorageUtils.validate(task).then(() => {

            const _resource_object = task.resource_object;

            return StorageUtils.destroy(_resource_object.type, _resource_object.id).then(() => {

                dispatch({
                    type: constants.ACTION_DESTROYED_TASK,
                    task
                });

            }).catch(Promise.reject);
        }).catch(Promise.reject);
    };
}

export function storeOrUpdateTask (task, project, user) {
    return function (dispatch) {

        return StorageUtils.validate(task).then(() => {

            const _resource_object = task.resource_object;

            return StorageUtils.view(_resource_object.type, _resource_object.id).then((response) => {

                // is not in storage

                if (typeof response === 'undefined') {
                    return dispatch(storeTask(task, project, user));
                }

                // is in storage

                return dispatch(updateTask(task));

            }).catch(Promise.reject);
        }).catch(Promise.reject);
    };
}

export function storeTask (task, project, user) {
    return function (dispatch) {

        return StorageUtils.validate(task).then(() => {

            const _task = new Task(Object.assign({}, task, { project_uuid: project.uuid, user_uuid: user.uuid }));
            return StorageUtils.store(_task).then((uuid) => {

                dispatch({
                    type: constants.ACTION_STORED_TASK,
                    task: _task
                });

            }).catch(Promise.reject);
        }).catch(Promise.reject);
    };
}

export function updateTask (task, data = {}) {
    return function (dispatch) {

        Promise.all([ StorageUtils.validate(task), StorageUtils.update(task, data) ]).then((responses) => {

            dispatch({
                type: constants.ACTION_UPDATED_TASK,
                task,
                data
            });

        }).catch(Promise.reject);
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
    return fetchTasks(project);
}

export function fetchTasks (project) {
    return function (dispatch) {

        return StorageUtils.indexRelated('tasks', 'project_uuid', project.uuid).then((tasks) => {

            dispatch({
                type: constants.ACTION_INDEXED_TASKS,
                data: tasks
            });

        }).catch(Promise.reject);
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
