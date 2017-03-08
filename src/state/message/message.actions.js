// app
import * as TaskActions from 'state/tasks/task.actions';

// local
import {
    ACTION_CANCEL_DELETE,
    ACTION_REQUEST_DELETE_CONFIRMATION
} from './message.settings';

// --------------------------
// delete
// --------------------------

export function cancelDelete () {
    return {
        type:    ACTION_CANCEL_DELETE
    };
}

export function requestDeleteConfirmation (data, callback) {
    return {
        type: ACTION_REQUEST_DELETE_CONFIRMATION,
        data,
        callback
    };
}
