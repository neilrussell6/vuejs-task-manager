import * as api_settings from 'state/redux-json-api.settings';

// ---------------------------
// public
// ---------------------------

export function app (state = {
    is_disabled: false
}, action) {

    switch (action.type) {

        case api_settings.API_CREATE_FAILED:
        case api_settings.API_CREATED:
        case api_settings.API_DELETE_FAILED:
        case api_settings.API_DELETED:
        case api_settings.API_READ_FAILED:
        case api_settings.API_READ:
        case api_settings.API_UPDATE_FAILED:
        case api_settings.API_UPDATED:
            return Object.assign({}, state, { is_disabled: false });

        case api_settings.API_WILL_CREATE:
        case api_settings.API_WILL_DELETE:
        case api_settings.API_WILL_READ:
        case api_settings.API_WILL_UPDATE:
            return Object.assign({}, state, { is_disabled: true });

        default:
            return state;
    }
}
