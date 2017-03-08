import { API_READ_FAILED, API_READ, API_UPDATED, API_UPDATE_FAILED, API_WILL_READ, API_WILL_UPDATE } from 'state/redux-json-api.settings';

// ---------------------------
// public
// ---------------------------

export function app (state = {
    is_disabled: false
}, action) {

    switch (action.type) {

        case API_READ_FAILED:
        case API_READ:
        case API_UPDATED:
        case API_UPDATE_FAILED:
            return Object.assign({}, state, { is_disabled: false });

        case API_WILL_READ:
        case API_WILL_UPDATE:
            return Object.assign({}, state, { is_disabled: true });

        default:
            return state;
    }
}
