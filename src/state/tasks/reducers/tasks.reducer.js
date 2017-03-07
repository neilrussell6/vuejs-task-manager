// app
import { API_READ, API_UPDATED, API_WILL_UPDATE, API_UPDATE_FAILED } from 'state/redux-json-api.settings';
import { Task, TASK_STATUS } from 'data/models/crud/jsonapi/task.model';

// local
import {
    // ACTION_ADD_TASK,
    ACTION_DELETE_TASK,
    ACTION_TOGGLE_TASK_COMPLETE,
    ACTION_TRASH_TASK,
    ACTION_UNDO_TRASH_TASK,
    ACTION_UPDATE_TASK,
    DEFAULT_TASK_LIST_STATE
} from '../task.settings';

// ---------------------------
// private
// ---------------------------

function task (task, action) {

    let data;

    switch (action.type) {

        // case ACTION_ADD_TASK:
        //     let local_id = LocalStorageUtils.getUniqueLocalId(action.tasks);
        //
        //     return new Task(Object.assign({}, action.data, { local_id }));

        case ACTION_UNDO_TRASH_TASK:
            if (task.unique_id !== action.unique_id) {
                return task;
            }

            data = Object.assign({}, task, {
                status: TASK_STATUS.INCOMPLETE
            });

            return new Task(data);

        case ACTION_TRASH_TASK:
            if (task.unique_id !== action.unique_id) {
                return task;
            }

            data = Object.assign({}, task, {
                status: TASK_STATUS.TRASH
            });

            return new Task(data);

        case ACTION_UPDATE_TASK:
            if (task.unique_id !== action.unique_id) {
                return task;
            }

            data = Object.assign({}, task, action.data);

            return new Task(data);

        case API_UPDATED:
            data = Object.assign({}, task.properties, action.payload.data.attributes);
            return new Task(data);

        case API_READ:
            data = Object.assign({}, { id: task.id }, { local_id: task.local_id }, task.attributes);
            return new Task(data);
    }
}

// ---------------------------
// public
// ---------------------------

export function tasks (list = DEFAULT_TASK_LIST_STATE, action) {

    switch (action.type) {

        // case ACTION_ADD_TASK:
        //     return [
        //         ...list,
        //         task({}, action)
        //     ]

        case ACTION_DELETE_TASK:
            let index = list.reduce((val, item, i) => (item.unique_id === action.unique_id) ? i : val, 0);

            return [
                ...list.slice(0, index),
                ...list.slice(index + 1)
            ];

        case ACTION_TRASH_TASK:
        case ACTION_UNDO_TRASH_TASK:
        case ACTION_UPDATE_TASK:
            return list.map((item) => task(item, action));

        case API_READ:
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

        case API_UPDATED:

            if (action.payload.data.type !== 'tasks') {
                return list;
            }

            // get index
            const _index = list.reduce((val, item, i) => (parseInt(item.server_id) === parseInt(action.payload.data.id)) ? i : val, null);

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
