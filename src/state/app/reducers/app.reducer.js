// state
import * as api_settings from 'state/redux-json-api.settings';
import { ARTIFICIAL_DELAY } from 'state/app.settings';

// local
import * as app_settings from '../app.settings';

// ---------------------------
// public
// ---------------------------

export function app (state = app_settings.DEFAULT_STATE, action) {

    switch (action.type) {

        case app_settings.ACTION_TOGGLE_ARTIFICIAL_DELAY:
            if (state.artificial_delay > 0) {
                return Object.assign({}, state, { artificial_delay: 0 });
            }
            return Object.assign({}, state, { artificial_delay: ARTIFICIAL_DELAY });

        case app_settings.ACTION_TOGGLE_MESSAGE_MINIMAL:
            console.log("XXXXXXXXXX", state.is_message_minimal);
            return Object.assign({}, state, { is_message_minimal: state.is_message_minimal ? false : true });

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
