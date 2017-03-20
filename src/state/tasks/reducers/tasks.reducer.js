// data
import { Task, TASK_STATUS } from 'data/models/crud/jsonapi/task.model';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as task_constants from '../task.constants';

// ---------------------------
// private
// ---------------------------

function task (state, action) {

    switch (action.type) {

        // ---------------------------
        // local storage
        // ---------------------------

        case task_constants.ACTION_INDEXED_TASKS:
            return new Task(action.data);

        case task_constants.ACTION_STORED_TASK:
        case task_constants.ACTION_UPDATED_TASK:
            return new Task(Object.assign({}, state, action.data));

        // ---------------------------
        // state
        // ---------------------------

        case task_constants.ACTION_MAKE_TASK:
            return new Task(Object.assign({}, action.data, { uuid: StorageUtils.makeUUID() }));
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
        // local storage
        // ---------------------------

        case task_constants.ACTION_INDEXED_TASKS:
            return action.data.map((item) => task({}, Object.assign({}, action, { data: item })));

        case task_constants.ACTION_STORED_TASK:
        case task_constants.ACTION_UPDATED_TASK:

            _index = state.reduce((val, item, i) => (item.uuid === action.task.uuid) ? i : val, 0);

            if (_index === null) {
                return state;
            }

            // ... and update with given data attributes
            _item = task(Object.assign({}, state[ _index ], action.task), action);

            // ... and splice it in at it's original index, but in a new collection
            return [
                ...state.slice(0, _index),
                ...[ _item ],
                ...state.slice(_index + 1)
            ];
        
        case task_constants.ACTION_DESTROYED_TASK:

            // get index
            _index = state.reduce((val, item, i) => (item.uuid === action.task.uuid) ? i : val, 0);
        
            if (_index === null) {
                return state;
            }
        
            // return a new collection excluding destroyed item
            return [
                ...state.slice(0, _index),
                ...state.slice(_index + 1)
            ];

        // ---------------------------
        // state
        // ---------------------------

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


        default:
            return state;
    }
}
