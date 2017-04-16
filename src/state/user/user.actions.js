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
import * as app_actions from 'state/app/app.actions';
import * as message_constants from 'state/message/message.constants';
import * as project_actions from 'state/projects/project.actions';
import * as storage_actions from 'state/storage/storage.actions';

// store
import { store } from 'state/store';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as constants from './user.constants';

// --------------------------
// user
// --------------------------

export function updateUser (user, data = {}) {
    return function (dispatch) {
        return new Promise((resolve, reject) => {

            // update in local storage
            StorageUtils.update(user, data).then((responses) => {

                dispatch({
                    type: constants.ACTION_STORAGE_LOCAL_UPDATED_USER,
                    user,
                    data
                });

                // if user is not authenticated
                if (!user.is_authenticated) {
                    return resolve();
                }

                // update on server
                // dispatch(updateResource(project.resource_object))
                //     .catch(() => {
                //         dispatch(STORAGE_UPDATE_FAILED);
                //     });

                resolve();

            }).catch((message) => console.error(message));
        });
    };
}

export function viewOrStoreUser () {
    return function (dispatch) {
        return new Promise((resolve, reject) => {

            let _state = store.getState();
            let _user;

            // get user from state
            if (_state.user !== null && typeof _state.user.uuid !== 'undefined') {

                dispatch({
                    type: constants.ACTION_STORAGE_LOCAL_VIEWED_USER,
                    data: _state.user
                });

                _state = store.getState();
                return resolve(_state.user);
            }

            // get user from local storage
            StorageUtils.index('users').then((users) => {

                if (users !== null && users.length === 1) {
                    _user = new User(users[0]);

                    dispatch({
                        type: constants.ACTION_STORAGE_LOCAL_VIEWED_USER,
                        data: _user
                    });

                    _state = store.getState();

                    // ... if user has no access token

                    if (_state.user === null || _state.user.access_token === null) {
                        return resolve(_state.user);
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
                            resolve(_state.user);

                        }).catch((message) => console.error(message));
                    }

                    // ... if access token is not expired

                    return dispatch(userAuthenticated(_state.user.access_token)).then((response) => {
                        return resolve(_state.user);
                    });
                }

                // clear existing users, then make and store new user
                StorageUtils.destroyAll('users').then(() => {

                    const uuid = StorageUtils.makeUUID();
                    const _user = new User({ uuid });

                    StorageUtils.store(_user).then(() => {

                        dispatch({
                            type: constants.ACTION_STORAGE_LOCAL_STORED_USER,
                            data: _user
                        });

                        _state = store.getState();
                        resolve(_state.user);
                    });
                }).catch((message) => console.error(message));
            }).catch((message) => console.error(message));
        });
    };
}

export function loginUser (user, credentials) {
    return function (dispatch) {
        return new Promise((resolve, reject) => {

            const _resource_object = {
                type: 'access_tokens',
                attributes: credentials
            };

            dispatch({ type: constants.ACTION_WILL_LOGIN_USER });

            // authenticate
            dispatch(createResource(_resource_object)).then((response) => {

                const _access_token = response.data.attributes.access_token;

                dispatch(userAuthenticated(_access_token)).then((response) => {

                    let _state = store.getState();

                    dispatch({
                        type: constants.ACTION_LOGGED_IN_USER,
                        user: _state.user
                    });

                    // index user's projects
                    dispatch(project_actions.indexProjects())
                        .then((response) => {

                            // index user's projects
                            dispatch(project_actions.indexProjects()).then((response) => {

                                console.log(_state);
                                console.log("~~~~~ serverSync ~~~~~");

                                window.setTimeout(() => {

                                    dispatch(storage_actions.serverSync())
                                        .then((response) => resolve())
                                        .catch((message) => {
                                            reject();
                                            console.error(message);
                                        });
                                }, 1000);

                            }).catch((message) => console.error(message));
                        })
                        .catch((message) => console.error(message));

                }).catch((message) => console.error(message));
            }).catch((error) => dispatch(storage_actions.serverError(error)));
        });
    };
}

export function userAuthenticated (access_token) {
    return function (dispatch) {
        return new Promise((resolve, reject) => {

            // set Auth header
            dispatch(setHeader({
                'Authorization': `Bearer ${access_token}`
            }));

            // get auth user
            dispatch(readEndpoint('access_tokens/owner')).then((response) => {

                dispatch({
                    type: constants.ACTION_USER_AUTHENTICATED,
                    access_token
                });

                dispatch({
                    type: constants.ACTION_STORAGE_SERVER_VIEWED_USER,
                    data: response.data
                });

                const _state = store.getState();

                // update local user
                dispatch(storage_actions.updateLocal(_state.user)).then((response) => {

                    resolve();

                    // // index user's projects
                    // dispatch(project_actions.indexProjects()).then((response) => {
                    //
                    //     console.log(_state);
                    //     console.log("~~~~~ serverSync ~~~~~");
                    //
                    //     window.setTimeout(() => {
                    //
                    //         dispatch(storage_actions.serverSync())
                    //             .then((response) => resolve())
                    //             .catch((message) => {
                    //                 reject();
                    //                 console.error(message);
                    //             });
                    //     }, 1000);
                    //
                    // }).catch((message) => console.error(message));

                }).catch((message) => console.error(message));

            }).catch((error) => {

                // connection error
                if (error instanceof TypeError && error.message === "Failed to fetch") {

                    dispatch({
                        type: constants.ACTION_USER_AUTHENTICATED,
                        access_token
                    });

                    return resolve();
                }

                dispatch(storage_actions.serverError(error));
            });
        });
    }
}
