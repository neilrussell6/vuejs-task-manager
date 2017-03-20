// data
import { User } from 'data/models/crud/jsonapi/user.model';

// state
import * as api_constants from 'state/redux-json-api.constants';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as user_constants from '../user.constants';

// ---------------------------
// public
// ---------------------------

export function user (state = user_constants.DEFAULT_STATE, action) {

    let _user;

    switch (action.type) {

        case api_constants.API_CREATED:

            if (action.payload.data.type !== 'access_tokens') {
                return state;
            }

            const _data = {
                access_token: action.payload.data.attributes.access_token,
                is_authenticated: true
            };
            _user = new User(Object.assign({}, state, _data));
            StorageUtils.store('user', _user);
            return _user;

        case user_constants.ACTION_FETCHED_USER:
            return action.data;
            // return new User(Object.assign({}, action.data, { is_authenticated: true }));

        case user_constants.ACTION_UPDATE_LOCAL_USER:
            _user = new User(Object.assign({}, state, action.data));
            StorageUtils.store('user', _user);
            return _user;

        default:
            return state;
    }
}
