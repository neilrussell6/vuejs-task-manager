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
