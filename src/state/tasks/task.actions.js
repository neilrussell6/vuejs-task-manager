// import { readEndpoint } from 'redux-json-api';

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

export function toggleTaskComplete (unique_id) {
    return {
        type:         ACTION_TOGGLE_TASK_COMPLETE,
        unique_id:    unique_id
    };
}

export function trashTask (unique_id) {
    return {
        type:         ACTION_TRASH_TASK,
        unique_id:    unique_id
    };
}

export function undoTrashTask (unique_id) {
    return {
        type:       ACTION_UNDO_TRASH_TASK,
        unique_id:  unique_id
    };
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

// export function refreshTasks (project) {
export function refreshTasks () {
    return fetchTasks();
}

export function fetchTasks (project) {
    return function (dispatch) {
        let _id = project.server_id;
        let _endpoint = `projects/${_id}/tasks`;
        console.log("FETCH TASKS");
        // dispatch(readEndpoint(_endpoint));
    };
}
