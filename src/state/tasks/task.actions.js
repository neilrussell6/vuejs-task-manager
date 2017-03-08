import { readEndpoint, updateResource, API_READ_FAILED, API_UPDATE_FAILED } from 'redux-json-api';

// data
import { JsonApiModel } from 'data/models/jsonapi.model';

// local
import {
    // ACTION_ADD_TASK,
    // ACTION_MAKE_TASK,
    ACTION_DELETE_TASK,
    ACTION_SET_COMPLETE_FILTER,
    ACTION_SET_TEXT_FILTER,
    ACTION_TOGGLE_TASK_COMPLETE,
    ACTION_TRASH_TASK,
    ACTION_UNDO_TRASH_TASK,
    ACTION_UPDATE_TASK
} from './task.settings';

// --------------------------
// text filter
// --------------------------

export function setTextFilter (value) {
    return {
        type:     ACTION_SET_TEXT_FILTER,
        value:    value
    };
}

// --------------------------
// complete filter
// --------------------------

export function setStatusFilter (value) {
    return {
        type:     ACTION_SET_COMPLETE_FILTER,
        value:    value
    };
}

// --------------------------
// task
// --------------------------

// export function addTask (tasks, data) {
//     return {
//         type:     ACTION_ADD_TASK,
//         tasks:    tasks,
//         data:     data
//     };
// }

export function deleteTask (unique_id) {
    return {
        type:       ACTION_DELETE_TASK,
        unique_id:  unique_id
    };
}

// export function makeTask () {
//     return {
//         type:     ACTION_MAKE_TASK
//     };
// }

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
    }
}

export function updateTask (unique_id, data) {
    return {
        type:         ACTION_UPDATE_TASK,
        unique_id:    unique_id,
        data:         data
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
