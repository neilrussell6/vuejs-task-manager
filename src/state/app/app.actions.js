// local
import * as settings from './app.constants';

// --------------------------

export function toggleArtificialDelay () {
    return {
        type: settings.ACTION_TOGGLE_ARTIFICIAL_DELAY
    };
}

export function toggleMinimalMessage () {
    return {
        type: settings.ACTION_TOGGLE_MESSAGE_MINIMAL
    };
}
