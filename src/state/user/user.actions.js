import {
    API_CREATE_FAILED,
    API_READ_FAILED,
    createResource,
    readEndpoint,
    setHeader
} from 'redux-json-api';

// data
import { JsonApiModel } from 'data/models/jsonapi.model';
import * as app_settings from 'data/app.settings';

// state
import * as ProjectActions from 'state/projects/project.actions';
import * as api_constants from 'state/redux-json-api.constants';

// local
import * as constants from './user.constants';

// --------------------------
// user
// --------------------------

export function updateUserLocally (data) {
    return {
        type: constants.ACTION_UPDATE_USER_LOCALLY,
        data
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
        // TODO: think of a better way to do this (problem is, delay-fetch middle doesn't delay the API call, only the response being passed down the line)
        dispatch({
            type: api_constants.API_WILL_CREATE,
            payload: { type: 'access_tokens' }
        });

        // authenticate
        window.setTimeout(() => {
            dispatch(createResource(_resource_object))
                .then((response) => {

                    const _access_token = response.data.attributes.access_token;

                    // set Auth header
                    dispatch(setHeader({
                        'Authorization': `Bearer ${_access_token}`
                    }));

                    // get auth user
                    window.setTimeout(() => {
                        const _endpoint = 'access_tokens/owner';
                        dispatch(readEndpoint(_endpoint))
                            .then((response) => {

                                dispatch(updateUserLocally(Object.assign({}, { id: response.data.id }, response.data.attributes)));
                                dispatch(ProjectActions.refreshProjects(response.data.id));
                            })
                            .catch(() => {
                                dispatch(API_READ_FAILED);
                            });
                    }, app_settings.LOGIN_DELAY);

                });
        }, app_settings.LOGIN_DELAY);
    };
}

export function logoutUser () {
    return function (dispatch) {

        dispatch(willLogoutUser());

        window.setTimeout(() => {

            dispatch(updateUserLocally({
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
