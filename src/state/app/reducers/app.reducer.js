// data
import { ARTIFICIAL_DELAY } from 'data/app.settings';

// state
import * as api_constants from 'state/redux-json-api.constants';
import * as user_constants from 'state/user/user.constants';

// local
import * as app_constants from '../app.constants';

// ---------------------------
// public
// ---------------------------

export function app (state = app_constants.DEFAULT_STATE, action) {

    switch (action.type) {

        case app_constants.ACTION_TOGGLE_ARTIFICIAL_DELAY:
            if (state.artificial_delay > 0) {
                return Object.assign({}, state, { artificial_delay: 0 });
            }
            return Object.assign({}, state, { artificial_delay: ARTIFICIAL_DELAY });

        case app_constants.ACTION_TOGGLE_MESSAGE_MINIMAL:
            return Object.assign({}, state, { is_message_minimal: state.is_message_minimal ? false : true });

        case api_constants.API_CREATE_FAILED:
        case api_constants.API_CREATED:
        case api_constants.API_DELETE_FAILED:
        case api_constants.API_DELETED:
        case api_constants.API_READ_FAILED:
        case api_constants.API_READ:
        case api_constants.API_UPDATE_FAILED:
        case api_constants.API_UPDATED:
        case user_constants.ACTION_USER_LOGGED_OUT:
            return Object.assign({}, state, { is_disabled: false });

        case api_constants.API_WILL_CREATE:
        case api_constants.API_WILL_DELETE:
        case api_constants.API_WILL_READ:
        // case api_constants.API_WILL_UPDATE:
        case user_constants.ACTION_WILL_LOGOUT_USER:
            return Object.assign({}, state, { is_disabled: true });

        default:
            return state;
    }
}
