import {
    readEndpoint
} from 'redux-json-api';

// state
import * as request_queue_actions from 'state/server-request-queue/server-request-queue.actions';
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

        const _state = store.getState();

        dispatch({ type: constants.ACTION_WILL_CONNECT });

        // get auth user
        return dispatch(readEndpoint(`users/${_state.user.server_id}`)).then((response) => {

            dispatch({ type: constants.ACTION_CONNECTED });

            // process request queue
            return dispatch(request_queue_actions.processQueue());

        }).catch(error => dispatch(storage_actions.serverError(error)));
    };
}
