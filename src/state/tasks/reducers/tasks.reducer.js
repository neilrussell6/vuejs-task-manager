// data
import { Task, TASK_STATUS } from 'data/models/crud/jsonapi/task.model';

// state
import * as api_constants from 'state/redux-json-api.constants';

// local
import * as task_constants from '../task.constants';

// ---------------------------
// private
// ---------------------------

function task (task, action) {

    let data;

    switch (action.type) {

        // case task_constants.ACTION_ADD_TASK:
        //     let local_id = LocalStorageUtils.getUniqueLocalId(action.tasks);
        //
        //     return new Task(Object.assign({}, action.data, { local_id }));

        case task_constants.ACTION_UPDATE_TASK:
            if (task.unique_id !== action.unique_id) {
                return task;
            }

            data = Object.assign({}, task, action.data);

            return new Task(data);

        case api_constants.API_UPDATED:
            data = Object.assign({}, task.properties, action.payload.data.attributes);
            return new Task(data);

        case api_constants.API_READ:
            data = Object.assign({}, { id: task.id }, { local_id: task.local_id }, task.attributes);
            return new Task(data);
    }
}

// ---------------------------
// public
// ---------------------------

export function tasks (list = task_constants.DEFAULT_TASK_LIST_STATE, action) {

    let _index;

    switch (action.type) {

        // case task_constants.ACTION_ADD_TASK:
        //     return [
        //         ...list,
        //         task({}, action)
        //     ]

        case task_constants.ACTION_DELETE_TASK:
            let index = list.reduce((val, item, i) => (item.unique_id === action.unique_id) ? i : val, 0);

            return [
                ...list.slice(0, index),
                ...list.slice(index + 1)
            ];

        case task_constants.ACTION_TRASH_TASK:
        case task_constants.ACTION_UNDO_TRASH_TASK:
        case task_constants.ACTION_UPDATE_TASK:
            return list.map((item) => task(item, action));

        case api_constants.API_READ:
            let _regex = new RegExp('tasks$');

            if (!_regex.test(action.payload.endpoint)) {
                return list;
            }

            return action.payload.data.reduce((result, item, i) => {

                if (item.type !== 'tasks') {
                    return result;
                }

                let local_id = i + 1;
                let _item = Object.assign({}, item, { local_id });

                result = [ ...result, task(_item, action) ];

                return result;
            }, []);

        case api_constants.API_DELETED:

            if (action.payload.type !== 'tasks') {
                return list;
            }

            // get index
            _index = list.reduce((val, item, i) => (parseInt(item.server_id) === parseInt(action.payload.id)) ? i : val, null);

            if (_index === null) {
                return list;
            }

            // return a new collection excluding deleted item
            return [
                ...list.slice(0, _index),
                ...list.slice(_index + 1)
            ];

        case api_constants.API_UPDATED:

            if (action.payload.data.type !== 'tasks') {
                return list;
            }

            // get index
            _index = list.reduce((val, item, i) => (parseInt(item.server_id) === parseInt(action.payload.data.id)) ? i : val, null);

            if (_index === null) {
                return list;
            }

            // ... and update with given data attributes
            const _item = task(list[ _index ], action);

            // ... and splice it in at it's original index, but in a new collection
            return [
                ...list.slice(0, _index),
                ...[ _item ],
                ...list.slice(_index + 1)
            ];

        default:
            return list;
    }
}
