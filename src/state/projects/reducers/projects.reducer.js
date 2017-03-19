// data
import { Project } from 'data/models/crud/jsonapi/project.model';

// state
import * as storage_constants from 'state/storage/storage.constants';
import * as common_reducer from 'state/common.reducer';
import * as common_constants from 'state/common.constants';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as project_constants from '../project.constants';

// ---------------------------
// private
// ---------------------------

function project (state, action) {

    let _data;

    switch (action.type) {

        // ---------------------------
        // project actions
        // ---------------------------

        case project_constants.ACTION_FETCHED_PROJECTS:
            return new Project(action.data);

        case project_constants.ACTION_UPDATE_PROJECT_LOCALLY:
            return new Project(Object.assign({}, state, action.data));

        // ---------------------------
        // storage actions
        // ---------------------------

        // case storage_constants.API_CREATED:
        //     _data = Object.assign({}, project.properties, action.payload.data.attributes, { id: action.payload.data.id });
        //     return new Project(_data);
        //
        // case storage_constants.API_UPDATED:
        //     _data = Object.assign({}, project.properties, action.payload.data.attributes);
        //     return new Project(_data);
        
        case storage_constants.ACTION_LOCAL_STORAGE_VIEWED:
            const uuid = StorageUtils.makeUUID();
            // _data = Object.assign({}, { id: project.id }, { uuid }, project.attributes);
            return new Project({});
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
        // project actions
        // ---------------------------

        case project_constants.ACTION_FETCHED_PROJECTS:
            return action.data.map((item) => project({}, Object.assign({}, action, { data: item })));

        case project_constants.ACTION_MAKE_PROJECT:
            return common_reducer.collection(state, Object.assign({}, action, {
                type: common_constants.ACTION_MAKE,
                model: Project
            }));

        case project_constants.ACTION_REMOVE_PROJECT:
            _index = state.reduce((val, item, i) => (item.uuid === action.uuid) ? i : val, 0);

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
