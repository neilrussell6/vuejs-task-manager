// data
import { User } from 'data/models/crud/jsonapi/user.model';

// state
import * as api_constants from 'state/redux-json-api.constants';

// local
import * as user_constants from '../user.constants';

// ---------------------------
// public
// ---------------------------

export function user (state = user_constants.DEFAULT_STATE, action) {

    switch (action.type) {

        case api_constants.API_CREATED:

            if (action.payload.data.type !== 'access_tokens') {
                return state;
            }

            return new User({
                access_token: action.payload.data.attributes.access_token,
                is_authenticated: true
            });

        case user_constants.ACTION_UPDATE_USER_LOCALLY:
            return new User(Object.assign({}, state, action.data));

        default:
            return state;
    }
}
