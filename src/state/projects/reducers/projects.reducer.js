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
// item
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
        // server
        // ---------------------------

        case project_constants.ACTION_SERVER_INDEXED_PROJECTS:

            // update existing item
            if (state !== null) {
                const _server_item = action.data.reduce((result, item) => item.id === state.server_id ? item : result, {});
                return new Project(Object.assign({}, state, _server_item));
            }

            // create new item
            return new Project(Object.assign({}, action.data, {
                uuid: StorageUtils.makeUUID(),
                user_uuid: action.user.uuid
            }));

        // ---------------------------
        // state
        // ---------------------------

        case project_constants.ACTION_MAKE_PROJECT:
            return new Project(Object.assign({}, action.data, { uuid: StorageUtils.makeUUID() }));

    }
}

// ---------------------------
// collection
// ---------------------------

export function projects (state = project_constants.DEFAULT_PROJECT_LIST_STATE, action = {}) {

    let _index;
    let _item;

    switch (action.type) {

        // ---------------------------
        // local storage
        // ---------------------------

        case project_constants.ACTION_INDEXED_PROJECTS:
            return action.projects.map((item) => project({}, Object.assign({}, action, { data: item })));

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
        // server
        // ---------------------------

        case project_constants.ACTION_SERVER_INDEXED_PROJECTS:
            // return action.data.map((item) => project({}, Object.assign({}, action, { data: item })));

            // update existing items
            const _existing_items = state.map((item) => project(item, action));
            const _existing_item_server_ids = _existing_items.map((item) => item.server_id);

            // add new items
            const _new_items = action.data.reduce((result, item) => {
                return _existing_item_server_ids.indexOf(item.id) > -1 ? result : [ ...result, project(null, Object.assign({}, action, { data: item })) ];
            }, []);

            // merge & sort by server_id
            return [ ..._existing_items, ... _new_items ].sort(function(a, b) {
                return parseInt(a.server_id) - parseInt(b.server_id);
            });

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

        default:
            return state;
    }
}
