import jws from 'jws';
import {
    API_CREATE_FAILED,
    API_READ_FAILED,
    createResource,
    readEndpoint,
    setHeader,
    setHeaders,
} from 'redux-json-api';

// data
import * as app_settings from 'data/app.settings';
import { JsonApiModel } from 'data/models/jsonapi.model';
import { User } from 'data/models/crud/jsonapi/user.model';

// state
import * as api_constants from 'state/redux-json-api.constants';

// store
import { store } from 'state/store';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as constants from './user.constants';

// --------------------------
// user
// --------------------------

export function updateLocalUser (data) {
    return {
        type: constants.ACTION_UPDATE_LOCAL_USER,
        data
    };
}

export function fetchOrCreateLocalUser(state) {
    return function (dispatch) {

        let _state = store.getState();
        let _user;

        // get user from state
        if (_state.user !== null && typeof _state.user.uuid !== 'undefined') {

            dispatch({
                type: constants.ACTION_FETCHED_USER,
                data: state.user
            });

            _state = store.getState();
            return Promise.resolve(_state.user);
        }

        // get user from local storage
        return StorageUtils.index('users').then((users) => {

            if (users !== null && users.length === 1) {
                _user = new User(users[0]);

                dispatch({
                    type: constants.ACTION_FETCHED_USER,
                    data: _user
                });

                _state = store.getState();
                return Promise.resolve(_state.user);
            }

            // clear existing users, then make and store new user
            return StorageUtils.destroyAll('users').then(() => {

                const uuid = StorageUtils.makeUUID();
                const _user = new User({ uuid });

                return StorageUtils.store(_user).then(() => {

                    // viewed
                    dispatch({
                        type: constants.ACTION_FETCHED_USER,
                        data: _user
                    });

                    _state = store.getState();
                    Promise.resolve(_state.user);
                });
            });
        });
    };
}

export function fetchOrCreateUser () {
    return function (dispatch) {

        // // ... if user has no access token
        // if (_state.user === null || _state.user.access_token === null) {
        //     return Promise.resolve(_state.user);
        // }
        //
        // // ... if access token is expired
        // const _access_token = jws.decode(_state.user.access_token);
        // const _numeric_date_access_token = _access_token.payload.exp;
        // const _numeric_date_now = Date.now() / 1000;
        //
        // if (_numeric_date_access_token < _numeric_date_now) {
        //     return Promise.resolve(_state.user);
        // }
        //
        // // ... if access token is not expired
        // return dispatch(fetchUser(_state.user.access_token))
        //     .then((response) => {
        //
        //         // update local user
        //         dispatch(updateLocalUser(Object.assign({}, { id: response.data.id }, response.data.attributes)));
        //
        //         // get user from state
        //         _state = store.getState();
        //
        //         return Promise.resolve(_state.user);
        //     })
        //     .catch(() => {
        //         dispatch(API_READ_FAILED);
        //     });
    };
}

export function fetchUser (access_token) {
    return function (dispatch) {

        // set Auth header
        dispatch(setHeader({
            'Authorization': `Bearer ${access_token}`
        }));

        // get auth user
        return dispatch(readEndpoint('access_tokens/owner'));
    };
}

// --------------------------
// login / logout
// --------------------------

export function loginUser (credentials) {
    return function (dispatch) {

        const _resource_object = {
            type: 'access_tokens',
            attributes: credentials
        };

        // fake 'will create' to prompt message
        // TODO: think of a better way to do this (problem is, delay-fetch middleware doesn't delay the API call, only the response being passed down the line)
        dispatch({
            type: api_constants.API_WILL_CREATE,
            payload: { type: 'access_tokens' }
        });

        // authenticate
        dispatch(createResource(_resource_object))
            .then((response) => {

                dispatch(fetchUser(response.data.attributes.access_token))
                    .then((response) => {

                        // update local user
                        dispatch(updateLocalUser(Object.assign({}, { id: response.data.id }, response.data.attributes)));
                    })
                    .catch(() => {
                        dispatch(API_READ_FAILED);
                    });
            });
    };
}

export function logoutUser () {
    return function (dispatch) {

        dispatch(willLogoutUser());

        // unset Auth header, by resetting all headers
        dispatch(setHeaders({
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
        }));

        window.setTimeout(() => {

            dispatch(updateLocalUser({
                is_authenticated: false,
                access_token: null
            }));

            dispatch(userLoggedOut());

        }, app_settings.LOGIN_DELAY);
    };
}

export function willLogoutUser () {
    return {
        type: constants.ACTION_WILL_LOGOUT_USER
    };
}

export function userLoggedOut () {
    return {
        type: constants.ACTION_USER_LOGGED_OUT
    };
}
