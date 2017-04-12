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

        // local

        case storage_constants.ACTION_STORAGE_LOCAL_STORED_USER:
        case storage_constants.ACTION_STORAGE_LOCAL_UPDATED_USER:
            return new User(Object.assign({}, state, action.resource, action.data));

        case user_constants.ACTION_STORAGE_LOCAL_VIEWED_USER:
            return new User(action.data);

        case user_constants.ACTION_STORAGE_SERVER_VIEWED_USER:
            return new User(Object.assign({}, state, action.data.attributes, { server_id: action.data.id }));

        case user_constants.ACTION_USER_AUTHENTICATED:
            return new User(Object.assign({}, state, {
                access_token: action.access_token,
                is_authenticated: true
            }));

        // ---------------------------
        // storage
        // ---------------------------

        // local

        // case storage_constants.ACTION_STORAGE_LOCAL_STORED:
        // case storage_constants.ACTION_STORAGE_LOCAL_UPDATED:
        //
        //     if (!(action.resource instanceof User)) {
        //         return state;
        //     }
        //
        //     return new User(Object.assign({}, state, action.resource, action.data));

        // ---------------------------

        default:
            return state;
    }
}
