// local
import * as constants from './message.constants';

// --------------------------
// actions
// --------------------------

export function setMessage (data) {
    return {
        type: constants.ACTION_SET_MESSAGE,
        data
    };
}

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
