// data
import { Task, TASK_STATUS } from 'data/models/crud/jsonapi/task.model';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// state
import * as storage_constants from 'state/storage/storage.constants';

// local
import * as task_constants from '../task.constants';

// ---------------------------
// private
// ---------------------------

function task (state, action) {

    switch (action.type) {

        // ---------------------------
        // tasks
        // ---------------------------

        // local

        case task_constants.ACTION_STORAGE_LOCAL_INDEXED_TASKS:
            return new Task(action.data);

        // server

        case task_constants.ACTION_STORAGE_SERVER_INDEXED_TASKS:

            // update existing item
            if (state !== null) {
                const _server_item = action.data.reduce((result, item) => {
                    return parseInt(item.id) === state.server_id ? item : result;
                }, {});
                return new Task(Object.assign({}, state, _server_item.attributes));
            }

            // create new item
            return new Task(Object.assign({}, action.data.attributes, {
                server_id: parseInt(action.data.id),
                uuid: StorageUtils.makeUUID(),
                user_uuid: action.user.uuid,
                project_uuid: action.project.uuid
            }));

        // state

        case task_constants.ACTION_MAKE_TASK:
            return new Task(Object.assign({}, action.data, { uuid: StorageUtils.makeUUID(), is_new: true }));

        // ---------------------------
        // storage
        // ---------------------------

        // local

        case storage_constants.ACTION_STORAGE_LOCAL_STORED:
        case storage_constants.ACTION_STORAGE_LOCAL_UPDATED:
            return new Task(Object.assign({}, state, action.data));
    }
}

// ---------------------------
// public
// ---------------------------

export function tasks (state = task_constants.DEFAULT_TASK_LIST_STATE, action) {

    let _index;
    let _item;

    switch (action.type) {

        // ---------------------------
        // tasks
        // ---------------------------

        // local

        case task_constants.ACTION_STORAGE_LOCAL_INDEXED_TASKS:
            return action.tasks.map((item) => task({}, Object.assign({}, action, { data: item })));

        // server

        case task_constants.ACTION_STORAGE_SERVER_INDEXED_TASKS:

            // update existing items
            const _existing_items = state.map((item) => task(item, action));
            const _existing_STORAGE_SERVER_item_ids = _existing_items.map((item) => item.server_id);

            // add new items
            const _new_items = action.data.reduce((result, item) => {
                return _existing_STORAGE_SERVER_item_ids.indexOf(parseInt(item.id)) > -1 ? result : [ ...result, task(null, Object.assign({}, action, { data: item })) ];
            }, []);

            // merge & sort by server_id
            return [ ..._existing_items, ... _new_items ].sort(function(a, b) {
                return parseInt(a.server_id) - parseInt(b.server_id);
            });

        // state

        case task_constants.ACTION_MAKE_TASK:
            return [
                ...state,
                task({}, action)
            ];

        case task_constants.ACTION_REMOVE_TASK:
            _index = state.reduce((val, item, i) => (item.uuid === action.uuid) ? i : val, 0);

            return [
                ...state.slice(0, _index),
                ...state.slice(_index + 1)
            ];

        // ---------------------------
        // storage
        // ---------------------------

        // local

        case storage_constants.ACTION_STORAGE_LOCAL_STORED:
        case storage_constants.ACTION_STORAGE_LOCAL_UPDATED:

            if (!(action.resource instanceof Task)) {
                return state;
            }

            _index = state.reduce((val, item, i) => (item.uuid === action.resource.uuid) ? i : val, 0);

            if (_index === null) {
                return state;
            }

            // ... and update with given data attributes
            _item = task(Object.assign({}, state[ _index ], action.resource), action);

            // ... and splice it in at it's original index, but in a new collection
            return [
                ...state.slice(0, _index),
                ...[ _item ],
                ...state.slice(_index + 1)
            ];

        case storage_constants.ACTION_STORAGE_LOCAL_DESTROYED:

            if (!(action.resource instanceof Task)) {
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

        // ---------------------------

        default:
            return state;
    }
}
