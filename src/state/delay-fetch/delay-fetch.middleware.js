import * as api_settings from 'state/redux-json-api.settings';
import { DELAY_HTTP_CALLS } from 'state/app.settings';

export const delayFetchMiddleware = store => next => action => {

    switch (action.type) {

        case api_settings.API_DELETE_FAILED:
        case api_settings.API_DELETED:
        case api_settings.API_READ_FAILED:
        case api_settings.API_READ:
        case api_settings.API_UPDATE_FAILED:
        case api_settings.API_UPDATED:
            let _timeout_id = window.setTimeout(() => {
                next(action);
            }, DELAY_HTTP_CALLS);

            return function cancel () {
                clearTimeout(_timeout_id);
            };

        default:
            return next(action);
    }
};
