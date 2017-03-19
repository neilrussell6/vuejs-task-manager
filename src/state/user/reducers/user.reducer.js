// data
import { User } from 'data/models/crud/jsonapi/user.model';

// state
import * as api_constants from 'state/redux-json-api.constants';

// utils
import * as LocalStorageUtils from 'utils/local-storage/local-storage.utils';
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

        case user_constants.ACTION_UPDATE_LOCAL_USER:
            _user = new User(Object.assign({}, state, action.data));
            StorageUtils.store('user', _user);
            return _user;

        // case user_constants.ACTION_FETCH_OR_CREATE_LOCAL_USER:
        //
        //     // user exists in state
        //     if (state !== null && typeof state.uuid !== 'undefined') {
        //         return state;
        //     }
        //
        //     // get user from local storage
        //     _user = StorageUtils.view('users');
        //     console.log(_user);
        //     // if (_user !== null) {
        //     //
        //     //     console.log(_user);
        //     //
        //     //     // ... return user from local storage
        //     //     return new User(_user);
        //     // }
        //     //
        //     // // user does not exist in state or in local storage
        //     // // ... make & store
        //     // const uuid = StorageUtils.makeUUID();
        //     // _user = new User({ uuid });
        //     // StorageUtils.store(_user);
        //
        //     // ... return new user
        //     return _user;

        default:
            return state;
    }
}
