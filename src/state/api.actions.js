import * as api_constants from './api.constants';

export function apiError (error) {
    return function (dispatch) {

        if (typeof error.response === 'undefined') {
            return dispatch({ type: api_constants.ACTION_API_ERROR_CONNECTION });
        }

        error.response.json().then((response) => {

            if (response.hasOwnProperty('errors') && response.errors.length > 0 && response.errors[0].status >= 400 && response.errors[0].status < 500) {
                return dispatch({
                    type: api_constants.ACTION_API_ERROR_BAD_REQUEST,
                    error: response.errors[0]
                });
            }

            dispatch({ type: api_constants.ACTION_API_ERROR_UNKNOWN });
        }).catch(() => {

            const _status = parseInt(error.response.status);
            if (_status >= 500 && _status < 600) {
                return dispatch({ type: api_constants.ACTION_API_ERROR_INTERNAL_SERVER });
            }

            dispatch({ type: api_constants.ACTION_API_ERROR_UNKNOWN });
        })
    };
}
