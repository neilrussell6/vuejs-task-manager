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

// local
import * as task_constants from './task.constants';

// --------------------------
// text filter
// --------------------------

export function setTextFilter (value) {
    return {
        type:     task_constants.ACTION_SET_TEXT_FILTER,
        value:    value
    };
}

// --------------------------
// complete filter
// --------------------------

export function setStatusFilter (value) {
    return {
        type:     task_constants.ACTION_SET_COMPLETE_FILTER,
        value:    value
    };
}

// --------------------------
// task
// --------------------------

export function createTask (task, project) {
    return function (dispatch) {

        if (!(task instanceof JsonApiModel) || task.resource_object === null) {
            throw new Error("Invalid model");
        }

        const _resource_object = Object.assign({}, task.resource_object, {
            relationships: {
                project: {
                    data: {
                        type: 'projects',
                        id: project.server_id
                    }
                }
            }
        });

        dispatch(createResource(_resource_object))
            .catch(() => {
                dispatch(API_CREATE_FAILED);
            });
    };
}

export function deleteTask (task) {
    return function (dispatch) {

        if (!(task instanceof JsonApiModel) || task.resource_identifier_object === null) {
            throw new Error("Invalid model");
        }

        dispatch(deleteResource(task.resource_identifier_object))
            .catch(() => {
                dispatch(API_DELETE_FAILED);
            });
    };
}

export function makeTask () {
    return {
        type:     task_constants.ACTION_MAKE_TASK
    };
}

export function removeTask (task) {
    return {
        type: task_constants.ACTION_REMOVE_TASK,
        task
    };
}

export function toggleTaskComplete (task) {
    return function (dispatch) {

        if (!(task instanceof JsonApiModel) || task.resource_object === null) {
            throw new Error("Invalid model");
        }

        const _task = task.toggleStatusComplete();

        dispatch(updateResource(_task.resource_object))
            .catch(() => {
                dispatch(API_READ_FAILED);
            });
    };
}

export function trashTask (task) {
    return function (dispatch) {

        if (!(task instanceof JsonApiModel) || task.resource_object === null) {
            throw new Error("Invalid model");
        }

        const _task = task.trash();

        dispatch(updateResource(_task.resource_object))
            .catch(() => {
                dispatch(API_UPDATE_FAILED);
            });
    };
}

export function undoTrashTask (task) {
    return function (dispatch) {

        if (!(task instanceof JsonApiModel) || task.resource_object === null) {
            throw new Error("Invalid model");
        }

        const _task = task.undoTrash();

        dispatch(updateResource(_task.resource_object))
            .catch(() => {
                dispatch(API_UPDATE_FAILED);
            });
    };
}

export function updateTask (task) {
    return function (dispatch) {

        if (!(task instanceof JsonApiModel) || task.resource_object === null) {
            throw new Error("Invalid model");
        }

        const _task = task.undoTrash();

        dispatch(updateResource(_task.resource_object))
            .catch(() => {
                dispatch(API_UPDATE_FAILED);
            });
    };
}

export function updateTaskLocally (task, data) {
    return {
        type: task_constants.ACTION_UPDATE_TASK_LOCALLY,
        task,
        data
    };
}

// --------------------------
// tasks
// --------------------------

export function refreshTasks (project) {
    return fetchTasks(project);
}

export function fetchTasks (project) {
    return function (dispatch) {
        let _id = project.server_id;
        let _endpoint = `projects/${_id}/tasks`;

        dispatch(readEndpoint(_endpoint))
            .catch(() => {
                dispatch(API_READ_FAILED);
            });
    };
}
