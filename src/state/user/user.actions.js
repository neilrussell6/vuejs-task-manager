import jws from 'jws';
import {
    createResource,
    readEndpoint,
    setHeader,
    setHeaders,
} from 'redux-json-api';

// data
import { JsonApiModel } from 'data/models/jsonapi.model';
import { User } from 'data/models/crud/jsonapi/user.model';

// state
import * as api_actions from 'state/api.actions';
import * as app_actions from 'state/app/app.actions';
import * as message_constants from 'state/message/message.constants';

// store
import { store } from 'state/store';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as constants from './user.constants';

// --------------------------
// user
// --------------------------

export function updateUser (user, data = {}, suppress_server_call = false) {
    return function (dispatch) {

        // update in local storage
        return StorageUtils.update(user, data).then((responses) => {

            dispatch({
                type: constants.ACTION_UPDATED_USER,
                user,
                data
            });

            let _state = store.getState();

            // if user is not authenticated or server call is suppressed
            if (!user.is_authenticated || suppress_server_call) {
                return Promise.resolve();
            }

            // update on server
            // dispatch(updateResource(project.resource_object))
            //     .catch(() => {
            //         dispatch(API_UPDATE_FAILED);
            //     });
            return Promise.resolve();

        }).catch((message) => console.error(message));
    };
}

export function viewOrStoreUser() {
    return function (dispatch) {

        let _state = store.getState();
        let _user;

        // get user from state
        if (_state.user !== null && typeof _state.user.uuid !== 'undefined') {

            dispatch({
                type: constants.ACTION_VIEWED_USER,
                data: _state.user
            });

            _state = store.getState();
            return Promise.resolve(_state.user);
        }

        // get user from local storage
        return StorageUtils.index('users').then((users) => {

            if (users !== null && users.length === 1) {
                _user = new User(users[0]);

                dispatch({
                    type: constants.ACTION_VIEWED_USER,
                    data: _user
                });

                _state = store.getState();

                // ... if user has no access token

                if (_state.user === null || _state.user.access_token === null) {
                    return Promise.resolve(_state.user);
                }

                // ... if access token is expired

                const _access_token = jws.decode(_state.user.access_token);
                const _numeric_date_access_token = _access_token.payload.exp;
                const _numeric_date_now = Date.now() / 1000;

                if (_numeric_date_access_token < _numeric_date_now) {

                    dispatch({
                        type: constants.ACTION_TOKEN_EXPIRED,
                        user: _state.user,
                        // work offline button handler
                        callback: () => {
                            dispatch({ type: message_constants.ACTION_CLEAR_MESSAGE });
                            dispatch(app_actions.workOffline());
                            dispatch(app_actions.toggleShowLogin());
                        }
                    });

                    return dispatch(updateUser(_state.user, { is_authenticated: false }, true)).then((response) => {

                        _state = store.getState();
                        return Promise.resolve(_state.user);

                    }).catch((message) => console.error(message));
                }

                // ... if access token is not expired

                // set Auth header
                dispatch(setHeader({
                    'Authorization': `Bearer ${_state.user.access_token}`
                }));

                return Promise.resolve(_state.user);
            }

            // clear existing users, then make and store new user
            return StorageUtils.destroyAll('users').then(() => {

                const uuid = StorageUtils.makeUUID();
                const _user = new User({ uuid });

                return StorageUtils.store(_user).then(() => {

                    dispatch({
                        type: constants.ACTION_STORED_USER,
                        data: _user
                    });

                    _state = store.getState();
                    return Promise.resolve(_state.user);
                });
            }).catch((message) => console.error(message));
        }).catch((message) => console.error(message));
    };
}

// --------------------------
// login / logout
// --------------------------

export function loginUser (user, credentials) {
    return function (dispatch) {

        const _resource_object = {
            type: 'access_tokens',
            attributes: credentials
        };

        dispatch({ type: constants.ACTION_WILL_LOGIN_USER });

        // authenticate
        dispatch(createResource(_resource_object)).then((response) => {

            // set Auth header
            const _access_token = response.data.attributes.access_token;
            dispatch(setHeader({
                'Authorization': `Bearer ${_access_token}`
            }));

            // get auth user
            return dispatch(readEndpoint('access_tokens/owner')).then((response) => {

                const _data = Object.assign({}, response.data.attributes, {
                    server_id: parseInt(response.data.id),
                    access_token: _access_token,
                    is_authenticated: true
                });

                return dispatch(updateUser(user, _data, true)).then((response) => {

                    let _state = store.getState();

                    dispatch({
                        type: constants.ACTION_LOGGED_IN_USER,
                        user: _state.user
                    });
                }).catch((message) => console.error(message));

            }).catch((error) => dispatch(api_actions.apiError(error)));
        }).catch((error) => dispatch(api_actions.apiError(error)));
    };
}
