// data
import { Project } from 'data/models/crud/jsonapi/project.model';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// state
import * as storage_constants from 'state/storage/storage.constants';

// local
import * as project_constants from '../project.constants';

// ---------------------------
// item
// ---------------------------

function project (state, action) {

    switch (action.type) {

        // ---------------------------
        // projects
        // ---------------------------

        // state

        case project_constants.ACTION_MAKE_PROJECT:
            return new Project(Object.assign({}, action.data, { uuid: StorageUtils.makeUUID(), is_new: true }));

        // ---------------------------
        // storage
        // ---------------------------

        // local

        case storage_constants.ACTION_STORAGE_LOCAL_INDEXED:
            return new Project(action.data);

        case storage_constants.ACTION_STORAGE_LOCAL_STORED:
        case storage_constants.ACTION_STORAGE_LOCAL_UPDATED:
            return new Project(Object.assign({}, state, action.data));

        // server

        case storage_constants.ACTION_STORAGE_SERVER_INDEXED:

            // update existing item
            if (state !== null) {
                const _server_item = action.data.reduce((result, item) => {
                    return parseInt(item.id) === state.server_id ? item : result;
                }, {});
                return new Project(Object.assign({}, state, _server_item.attributes));
            }

            // create new item
            return new Project(Object.assign({}, action.data.attributes, {
                server_id: parseInt(action.data.id),
                uuid: StorageUtils.makeUUID(),
                user_uuid: action.user.uuid
            }));
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
        // projects
        // ---------------------------

        // state

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
        // storage
        // ---------------------------

        // local

        case storage_constants.ACTION_STORAGE_LOCAL_INDEXED:

            console.log("ACTION_STORAGE_LOCAL_INDEXED ::: projects");
            console.log(action);

            if (!action.hasOwnProperty('data') || action.data.type !== 'projects') {
                return state;
            }

            return action.projects.map((item) => project({}, Object.assign({}, action, { data: item })));

        case storage_constants.ACTION_STORAGE_LOCAL_STORED:
        case storage_constants.ACTION_STORAGE_LOCAL_UPDATED:

            console.log("ACTION_STORAGE_LOCAL_STORED/UPDATED ::: projects");
            console.log(action);

            if (!action.hasOwnProperty('data') || action.data.type !== 'projects') {
                return state;
            }

            _index = state.reduce((val, item, i) => (item.uuid === action.resource.uuid) ? i : val, 0);

            if (_index === null) {
                return state;
            }

            // ... and update with given data attributes
            _item = project(Object.assign({}, state[ _index ], action.resource), action);

            // ... and splice it in at it's original index, but in a new collection
            return [
                ...state.slice(0, _index),
                ...[ _item ],
                ...state.slice(_index + 1)
            ];

        // server

        case storage_constants.ACTION_STORAGE_SERVER_INDEXED:

            console.log("ACTION_STORAGE_SERVER_INDEXED ::: projects");
            console.log(action);

            // update existing items
            const _existing_items = state.map((item) => project(item, action));
            const _existing_STORAGE_SERVER_item_ids = _existing_items.map((item) => item.server_id);

            // add new items
            const _new_items = action.data.reduce((result, item) => {
                return _existing_STORAGE_SERVER_item_ids.indexOf(parseInt(item.id)) > -1 ? result : [ ...result, project(null, Object.assign({}, action, { data: item })) ];
            }, []);

            // merge & sort by server_id
            return [ ..._existing_items, ... _new_items ].sort(function(a, b) {
                return parseInt(a.server_id) - parseInt(b.server_id);
            });

        // ---------------------------

        default:
            return state;
    }
}
