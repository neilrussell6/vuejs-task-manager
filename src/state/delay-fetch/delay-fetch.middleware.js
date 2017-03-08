import * as api_settings from 'state/redux-json-api.settings';
import { ARTIFICIAL_DELAY } from 'state/app.settings';

export const delayFetchMiddleware = store => next => action => {

    switch (action.type) {

        case api_settings.API_DELETE_FAILED:
        case api_settings.API_DELETED:
        case api_settings.API_READ_FAILED:
        case api_settings.API_READ:
        case api_settings.API_UPDATE_FAILED:
        case api_settings.API_UPDATED:

            const _state = store.getState();
            const _delay = _state.app.artificial_delay;

            if (!_delay) {
                next(action);
            }

            let _timeout_id = window.setTimeout(() => {
                next(action);
            }, _delay);

            return function cancel () {
                clearTimeout(_timeout_id);
            };

        default:
            return next(action);
    }
};
