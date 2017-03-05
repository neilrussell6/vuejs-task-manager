import { API_READ } from 'state/redux-json-api.settings';
import { DELAY_FETCH } from 'state/app.settings';

export const delayFetchMiddleware = store => next => action => {

    switch (action.type) {
        case API_READ:
            console.log('delaying ...');
            let _timeout_id = window.setTimeout(() => {
                console.log('delayed');
                next(action);
            }, DELAY_FETCH);

            return function cancel () {
                clearTimeout(_timeout_id);
            };

        default:
            return next(action);
    }
};
