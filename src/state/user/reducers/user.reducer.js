// data
import { User } from 'data/models/crud/jsonapi/user.model';

// local
import * as user_constants from '../user.constants';

// ---------------------------
// public
// ---------------------------

export function user (state = user_constants.DEFAULT_STATE, action) {

    switch (action.type) {

        // ---------------------------
        // local storage
        // ---------------------------

        case user_constants.ACTION_VIEWED_USER:
            return new User(action.data);

        case user_constants.ACTION_STORED_USER:
        case user_constants.ACTION_UPDATED_USER:
            return new User(Object.assign({}, state, action.data));

        default:
            return state;
    }
}
