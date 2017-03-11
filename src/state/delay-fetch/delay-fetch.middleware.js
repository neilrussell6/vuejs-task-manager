// state
import * as api_constants from 'state/redux-json-api.constants';

export const delayFetchMiddleware = store => next => action => {

    const _state = store.getState();
    // const _was_authentication_request = action.type === api_constants.API_CREATED && action.payload.data.type === 'access_tokens';
    // const _delay = _was_authentication_request ? app_settings.LOGIN_DELAY : _state.app.artificial_delay;
    const _delay = _state.app.artificial_delay;
    let _timeout_id;

    switch (action.type) {
        case api_constants.API_CREATE_FAILED:
        case api_constants.API_CREATED:
        case api_constants.API_DELETE_FAILED:
        case api_constants.API_DELETED:
        case api_constants.API_READ_FAILED:
        case api_constants.API_READ:
        case api_constants.API_UPDATE_FAILED:
        case api_constants.API_UPDATED:

            if (!_delay) {
                next(action);
            }

            _timeout_id = window.setTimeout(() => {
                next(action);
            }, _delay);

            return function cancel () {
                clearTimeout(_timeout_id);
            };

        default:
            return next(action);
    }
};
