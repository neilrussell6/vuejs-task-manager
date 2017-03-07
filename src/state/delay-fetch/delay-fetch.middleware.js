import { API_READ_FAILED, API_READ, API_UPDATED, API_UPDATE_FAILED } from 'state/redux-json-api.settings';
import { DELAY_HTTP_CALLS } from 'state/app.settings';

export const delayFetchMiddleware = store => next => action => {

    switch (action.type) {

        case API_READ_FAILED:
        case API_READ:
        case API_UPDATE_FAILED:
        case API_UPDATED:
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
