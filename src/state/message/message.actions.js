// local
import * as constants from './message.constants';

// --------------------------
// delete
// --------------------------

export function cancelDelete () {
    return {
        type: constants.ACTION_CANCEL_DELETE
    };
}

export function requestDeleteConfirmation (data, callback) {
    return {
        type: constants.ACTION_REQUEST_DELETE_CONFIRMATION,
        data,
        callback
    };
}
