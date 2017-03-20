// data
import { Project } from 'data/models/crud/jsonapi/project.model';

// state
import * as storage_constants from 'state/storage/storage.constants';
// import * as common_reducer from 'state/common.reducer';
// import * as common_constants from 'state/common.constants';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as project_constants from '../project.constants';

// ---------------------------
// private
// ---------------------------

function project (state, action) {

    switch (action.type) {

        // ---------------------------
        // local storage
        // ---------------------------

        case project_constants.ACTION_INDEXED_PROJECTS:
            return new Project(action.data);

        case project_constants.ACTION_STORED_PROJECT:
        case project_constants.ACTION_UPDATED_PROJECT:
            return new Project(Object.assign({}, state, action.data));

        // ---------------------------
        // state
        // ---------------------------

        case project_constants.ACTION_MAKE_PROJECT:
            return new Project(Object.assign({}, action.data, { uuid: StorageUtils.makeUUID() }));

    }
}

// ---------------------------
// public
// ---------------------------

export function projects (state = project_constants.DEFAULT_PROJECT_LIST_STATE, action = {}) {

    let _index;
    let _item;

    switch (action.type) {

        // ---------------------------
        // local storage
        // ---------------------------

        case project_constants.ACTION_INDEXED_PROJECTS:
            return action.data.map((item) => project({}, Object.assign({}, action, { data: item })));

        case project_constants.ACTION_STORED_PROJECT:
        case project_constants.ACTION_UPDATED_PROJECT:

            _index = state.reduce((val, item, i) => (item.uuid === action.project.uuid) ? i : val, 0);

            if (_index === null) {
                return state;
            }

            // ... and update with given data attributes
            _item = project(Object.assign({}, state[ _index ], action.project), action);

            // ... and splice it in at it's original index, but in a new collection
            return [
                ...state.slice(0, _index),
                ...[ _item ],
                ...state.slice(_index + 1)
            ];

        // ---------------------------
        // state
        // ---------------------------

        case project_constants.ACTION_MAKE_PROJECT:
            return [
                ...state,
                project({}, action)
            ];

        case project_constants.ACTION_REMOVE_PROJECT:
            _index = state.reduce((val, item, i) => (item.uuid === action.uuid) ? i : val, 0);

            return [
                ...state.slice(0, _index),
                ...state.slice(_index + 1)
            ];

        // ---------------------------
        // storage actions
        // ---------------------------

        // case storage_constants.API_CREATED:
        //
        //     if (action.type !== 'projects') {
        //         return state;
        //     }
        //
        //     // get index
        //     _index = state.reduce((val, item, i) => !item.hasOwnProperty('uuid') ? i : val, null);
        //
        //     if (_index === null) {
        //         return state;
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
        //
        // case storage_constants.ACTION_LOCAL_STORAGE_VIEWED:
        //
        //     let _regex = new RegExp('projects$');
        //
        //     if (!_regex.test(action.endpoint)) {
        //         return state;
        //     }
        //
        //     if (action.response === null) {
        //         return state;
        //     }
        //
        //     return action.response.data.reduce((result, item) => {
        //
        //         if (item.type !== 'projects') {
        //             return result;
        //         }
        //
        //         result = [ ...result, project(item, action) ];
        //
        //         return result;
        //     }, []);

        default:
            return state;
    }
}
