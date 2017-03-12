// data
import { Task, TASK_STATUS } from 'data/models/crud/jsonapi/task.model';

// state
import * as api_constants from 'state/redux-json-api.constants';
import * as project_constants from 'state/projects/project.constants';

// utils
import * as LocalStorageUtils from 'utils/local-storage/local-storage.utils';

// local
import * as task_constants from '../task.constants';

// ---------------------------
// private
// ---------------------------

function task (task, action) {

    let _data;

    switch (action.type) {

        case task_constants.ACTION_MAKE_TASK:
            _data = Object.assign({}, action.data );
            return new Task(_data);

        case task_constants.ACTION_UPDATE_TASK_LOCALLY:
            _data = Object.assign({}, task, action.data);
            return new Task(_data);

        case api_constants.API_CREATED:
            _data = Object.assign({}, task.properties, action.payload.data.attributes, { id: action.payload.data.id });
            return new Task(_data);

        case api_constants.API_UPDATED:
            _data = Object.assign({}, task.properties, action.payload.data.attributes);
            return new Task(_data);

        case api_constants.API_READ:
            const local_id = LocalStorageUtils.getUniqueLocalId();
            _data = Object.assign({}, { id: task.id }, { local_id }, task.attributes);
            return new Task(_data);
    }
}

// ---------------------------
// public
// ---------------------------

export function tasks (list = task_constants.DEFAULT_TASK_LIST_STATE, action) {

    let _index;
    let _item;

    switch (action.type) {

        case task_constants.ACTION_MAKE_TASK:
            const _new_task = task({}, Object.assign({}, action, {
                data: {
                    local_id: LocalStorageUtils.getUniqueLocalId()
                }
            }));

            return [
                ...list,
                _new_task
            ];

        case task_constants.ACTION_REMOVE_TASK:
            _index = list.reduce((val, item, i) => (item.local_id === action.task.local_id) ? i : val, 0);

            return [
                ...list.slice(0, _index),
                ...list.slice(_index + 1)
            ];

        case task_constants.ACTION_UPDATE_TASK_LOCALLY:
            _index = list.reduce((val, item, i) => (item.local_id === action.task.local_id) ? i : val, 0);

            if (_index === null) {
                return list;
            }

            // ... and update with given data attributes
            _item = task(list[ _index ], action);

            // ... and splice it in at it's original index, but in a new collection
            return [
                ...list.slice(0, _index),
                ...[ _item ],
                ...list.slice(_index + 1)
            ];

        case api_constants.API_CREATED:

            if (action.payload.data.type !== 'tasks') {
                return list;
            }

            // get index
            _index = list.reduce((val, item, i) => !item.hasOwnProperty('server_id') ? i : val, null);

            if (_index === null) {
                return list;
            }

            // ... and update with given data attributes
            _item = task(list[ _index ], action);

            // ... and splice it in at it's original index, but in a new collection
            return [
                ...list.slice(0, _index),
                ...[ _item ],
                ...list.slice(_index + 1)
            ];

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

        case api_constants.API_READ:
            let _regex = new RegExp('tasks$');

            if (!_regex.test(action.payload.endpoint)) {
                return list;
            }

            return action.payload.data.reduce((result, item) => {

                if (item.type !== 'tasks') {
                    return result;
                }

                result = [ ...result, task(item, action) ];

                return result;
            }, []);

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
            _item = task(list[ _index ], action);

            // ... and splice it in at it's original index, but in a new collection
            return [
                ...list.slice(0, _index),
                ...[ _item ],
                ...list.slice(_index + 1)
            ];

        case project_constants.ACTION_MAKE_PROJECT:
        case project_constants.ACTION_DESELECT_PROJECT:
            return task_constants.DEFAULT_TASK_LIST_STATE;

        default:
            return list;
    }
}
