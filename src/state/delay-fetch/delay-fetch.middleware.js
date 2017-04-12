// state
import * as storage_constants from 'state/storage/storage.constants';

export const delayFetchMiddleware = store => next => action => {

    const _state = store.getState();
    // const _was_authentication_request = action.type === redux_jsonstorage_constants.STORAGE_CREATED && action.payload.data.type === 'access_tokens';
    // const _delay = _was_authentication_request ? app_settings.LOGIN_DELAY : _state.app.artificial_delay;
    const _delay = _state.app.artificial_delay;
    let _timeout_id;

    switch (action.type) {
        case storage_constants.STORAGE_CREATE_FAILED:
        case storage_constants.STORAGE_CREATED:
        case storage_constants.STORAGE_DELETE_FAILED:
        case storage_constants.STORAGE_DELETED:
        case storage_constants.STORAGE_READ_FAILED:
        case storage_constants.STORAGE_READ:
        case storage_constants.STORAGE_UPDATE_FAILED:
        case storage_constants.STORAGE_UPDATED:

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
