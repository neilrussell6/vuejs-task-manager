// state
import * as common_constants from 'state/common.constants';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

export function item (state, action) {

    switch (action.type) {

        // ---------------------------
        // common actions
        // ---------------------------

        case common_constants.ACTION_MAKE:
            return new action.model(Object.assign({}, action.data, { uuid: StorageUtils.makeUUID() }));

        // ---------------------------
        // storage actions
        // ---------------------------

    }
}

// ---------------------------
// public
// ---------------------------

export function collection (state, action) {

    let _index;
    let _item;

    switch (action.type) {

        // ---------------------------
        // common actions
        // ---------------------------

        case common_constants.ACTION_MAKE:
            return [
                ...state,
                item({}, Object.assign({}, action, { index: state.length }))
            ];

        case project_constants.ACTION_REMOVE_PROJECT:
            _index = state.reduce((val, item, i) => (item.uuid === action.data.uuid) ? i : val, 0);

            return [
                ...state.slice(0, _index),
                ...state.slice(_index + 1)
            ];

        case project_constants.ACTION_UPDATE_PROJECT_LOCALLY:
            _index = state.reduce((val, item, i) => (item.local_id === action.project.local_id) ? i : val, 0);

            if (_index === null) {
                return state;
            }

            // ... and update with given data attributes
            _item = project(state[ _index ], action);

            // ... and splice it in at it's original index, but in a new collection
            return [
                ...state.slice(0, _index),
                ...[ _item ],
                ...state.slice(_index + 1)
            ];

        // ---------------------------
        // storage actions
        // ---------------------------

        // case storage_constants.API_CREATED:
        //
        //     if (action.payload.data.type !== 'projects') {
        //         return list;
        //     }
        //
        //     // get index
        //     _index = list.reduce((val, item, i) => !item.hasOwnProperty('server_id') ? i : val, null);
        //
        //     if (_index === null) {
        //         return list;
        //     }
        //
        //     // ... and update with given data attributes
        //     _item = project(list[ _index ], action);
        //
        //     // ... and splice it in at it's original index, but in a new collection
        //     return [
        //         ...list.slice(0, _index),
        //         ...[ _item ],
        //         ...list.slice(_index + 1)
        //     ];
        //
        // case storage_constants.API_DELETED:
        //
        //     if (action.payload.type !== 'projects') {
        //         return list;
        //     }
        //
        //     // get index
        //     _index = list.reduce((val, item, i) => (parseInt(item.server_id) === parseInt(action.payload.id)) ? i : val, null);
        //
        //     if (_index === null) {
        //         return list;
        //     }
        //
        //     // return a new collection excluding deleted item
        //     return [
        //         ...list.slice(0, _index),
        //         ...list.slice(_index + 1)
        //     ];

        case storage_constants.ACTION_LOCAL_STORAGE_VIEWED:

            let _regex = new RegExp('projects$');

            if (!_regex.test(action.endpoint)) {
                return state;
            }

            if (action.response === null) {
                return state;
            }
            console.log(action.response);

            return action.response.data.reduce((result, item) => {

                if (item.type !== 'projects') {
                    return result;
                }

                result = [ ...result, project(item, action) ];

                return result;
            }, []);

        default:
            return state;
    }
}
