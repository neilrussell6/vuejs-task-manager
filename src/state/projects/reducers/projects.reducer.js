// data
import { Project } from 'data/models/crud/jsonapi/project.model';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// state
import * as storage_constants from 'state/storage/storage.constants';
import * as storage_reducer from 'state/storage/reducers/storage.reducer';

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

        case storage_constants.ACTION_STORAGE_LOCAL_INDEXED:
            return new Project(action.resource);

        case storage_constants.ACTION_STORAGE_LOCAL_STORED:
        case storage_constants.ACTION_STORAGE_LOCAL_UPDATED:
            return new Project(Object.assign({}, state, action.data));

        // server

        case storage_constants.ACTION_STORAGE_SERVER_INDEXED:

            // create new item
            if (state === null) {
                return new Project(Object.assign({}, action.resource.attributes, {
                    server_id: parseInt(action.resource.id),
                    uuid: StorageUtils.makeUUID(),
                    user_uuid: action.related.user.uuid
                }));
            }

            // update existing item
            const _server_item = action.resources.reduce((result, item) => {
                return parseInt(item.id) === state.server_id ? item : result;
            }, {});

            return new Project(Object.assign({}, state, _server_item.attributes));
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

        case storage_constants.ACTION_STORAGE_LOCAL_DESTROYED:

            if (action.resource_type !== 'projects') {
                return state;
            }

            // get index
            _index = state.reduce((val, item, i) => (item.uuid === action.resource.uuid) ? i : val, 0);

            if (_index === null) {
                return state;
            }

            // return a new collection excluding destroyed item
            return [
                ...state.slice(0, _index),
                ...state.slice(_index + 1)
            ];

        case storage_constants.ACTION_STORAGE_LOCAL_INDEXED:

            if (action.resource_type !== 'projects') {
                return state;
            }

            return action.resources.map((item) => project({}, Object.assign({}, {
                type: action.type,
                resource: item
            })));

        case storage_constants.ACTION_STORAGE_LOCAL_STORED:
        case storage_constants.ACTION_STORAGE_LOCAL_UPDATED:

            if (action.resource_type !== 'projects') {
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

            if (action.resource_type !== 'projects') {
                return state;
            }

            // update existing items
            const _existing_items = state.map(item => project(item, {
                type: action.type,
                resources: action.resources
            }));
            const _existing_storage_server_item_ids = _existing_items.map(item => item.server_id);

            // add new items
            const _new_items = action.resources.reduce((result, item) => {

                if (_existing_storage_server_item_ids.indexOf(parseInt(item.id)) > -1) {
                    return result;
                }

                return [
                    ...result,
                    project(null, Object.assign({}, action, {
                        type: action.type,
                        resource: item
                    }))
                ];
            }, []);

            // merge & sort by server_id
            return [ ..._existing_items, ..._new_items ].sort(function(a, b) {
                return parseInt(a.server_id) - parseInt(b.server_id);
            });

        // ---------------------------

        default:
            return state;
    }
}
