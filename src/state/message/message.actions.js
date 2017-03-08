// local
import * as settings from './message.constants';

// --------------------------
// delete
// --------------------------

export function cancelDelete () {
    return {
        type: settings.ACTION_CANCEL_DELETE
    };
}

export function requestDeleteConfirmation (data, callback) {
    return {
        type: settings.ACTION_REQUEST_DELETE_CONFIRMATION,
        data,
        callback
    };
}
