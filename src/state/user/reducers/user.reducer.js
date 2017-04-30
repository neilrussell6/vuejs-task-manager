// data
import { User } from 'data/models/crud/jsonapi/user.model';

// state
import * as storage_constants from 'state/storage/storage.constants';

// local
import * as user_constants from '../user.constants';

// ---------------------------
// public
// ---------------------------

export function user (state = user_constants.DEFAULT_STATE, action) {

    switch (action.type) {

        // ---------------------------
        // user
        // ---------------------------

        case user_constants.ACTION_USER_AUTHENTICATED:
            return new User(Object.assign({}, state, {
                access_token: action.access_token,
                server_id: action.user_id,
                is_authenticated: true
            }));

        // ---------------------------
        // storage
        // ---------------------------

        // local

        case storage_constants.ACTION_STORAGE_LOCAL_STORED:
        case storage_constants.ACTION_STORAGE_LOCAL_UPDATED:

            if (action.resource_type !== 'users') {
                return state;
            }

            return new User(Object.assign({}, state, action.resource, action.data));

        case storage_constants.ACTION_STORAGE_LOCAL_VIEWED:

            if (action.resource_type !== 'users') {
                return state;
            }

            return new User(action.resource);

        // server

        case storage_constants.ACTION_STORAGE_SERVER_VIEWED:

            if (action.resource_type !== 'users') {
                return state;
            }

            return new User(Object.assign({}, state, action.resource.attributes, { server_id: action.resource.id }));

        // ---------------------------

        default:
            return state;
    }
}
