import {
    readEndpoint
} from 'redux-json-api';

// state
import * as storage_actions from 'state/storage/storage.actions';

// store
import { store } from 'state/store';

// local
import * as constants from './app.constants';

// --------------------------

export function toggleShowLogin () {
    return {
        type: constants.ACTION_TOGGLE_SHOW_LOGIN
    };
}

export function toggleArtificialDelay () {
    return {
        type: constants.ACTION_TOGGLE_ARTIFICIAL_DELAY
    };
}

export function toggleMinimalMessage () {
    return {
        type: constants.ACTION_TOGGLE_MESSAGE_MINIMAL
    };
}

export function workOffline () {
    return {
        type: constants.ACTION_WORK_OFFLINE
    };
}

export function connect () {
    return function(dispatch) {

        let _state = store.getState();

        dispatch({ type: constants.ACTION_WILL_CONNECT });

        window.setTimeout(() => {

            // get auth user
            dispatch(readEndpoint(`users/${_state.user.server_id}`)).then((response) => {

                dispatch({ type: constants.ACTION_CONNECTED });

                window.setTimeout(() => {

                    // sync api
                    dispatch(storage_actions.serverSync());

                }, 500);
            }).catch((error) => dispatch(storage_actions.serverError(error)));
        }, 500);
    };
}
