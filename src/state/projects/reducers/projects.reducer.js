// data
import { Project } from 'data/models/crud/jsonapi/project.model';

// state
import * as api_constants from 'state/redux-json-api.constants';

// utils
import * as LocalStorageUtils from 'utils/local-storage/local-storage.utils';

// local
import * as project_constants from '../project.constants';

// ---------------------------
// private
// ---------------------------

function project (project, action) {

    let _data;

    switch (action.type) {

        case project_constants.ACTION_MAKE_PROJECT:
            _data = Object.assign({}, action.data );
            return new Project(_data);

        case project_constants.ACTION_UPDATE_PROJECT_LOCALLY:
            _data = Object.assign({}, project, action.data);
            return new Project(_data);

        case api_constants.API_CREATED:
            _data = Object.assign({}, project.properties, action.payload.data.attributes, { id: action.payload.data.id });
            return new Project(_data);

        case api_constants.API_UPDATED:
            _data = Object.assign({}, project.properties, action.payload.data.attributes);
            return new Project(_data);

        case api_constants.API_READ:
            const local_id = LocalStorageUtils.getUniqueLocalId();
            _data = Object.assign({}, { id: project.id }, { local_id }, project.attributes);
            return new Project(_data);
    }
}

// ---------------------------
// public
// ---------------------------

export function projects (list = project_constants.DEFAULT_PROJECT_LIST_STATE, action) {

    let _index;
    let _item;

    switch (action.type) {
        case project_constants.ACTION_MAKE_PROJECT:
            const _new_project = project({}, Object.assign({}, action, {
                data: {
                    local_id: LocalStorageUtils.getUniqueLocalId()
                }
            }));

            return [
                ...list,
                _new_project
            ];

        case project_constants.ACTION_REMOVE_PROJECT:
            _index = list.reduce((val, item, i) => (item.local_id === action.project.local_id) ? i : val, 0);

            return [
                ...list.slice(0, _index),
                ...list.slice(_index + 1)
            ];

        case project_constants.ACTION_UPDATE_PROJECT_LOCALLY:
            _index = list.reduce((val, item, i) => (item.local_id === action.project.local_id) ? i : val, 0);

            if (_index === null) {
                return list;
            }

            // ... and update with given data attributes
            _item = project(list[ _index ], action);

            // ... and splice it in at it's original index, but in a new collection
            return [
                ...list.slice(0, _index),
                ...[ _item ],
                ...list.slice(_index + 1)
            ];

        case api_constants.API_CREATED:

            if (action.payload.data.type !== 'projects') {
                return list;
            }

            // get index
            _index = list.reduce((val, item, i) => !item.hasOwnProperty('server_id') ? i : val, null);

            if (_index === null) {
                return list;
            }

            // ... and update with given data attributes
            _item = project(list[ _index ], action);

            // ... and splice it in at it's original index, but in a new collection
            return [
                ...list.slice(0, _index),
                ...[ _item ],
                ...list.slice(_index + 1)
            ];

        case api_constants.API_DELETED:

            if (action.payload.type !== 'projects') {
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

            let _regex = new RegExp('projects$');

            if (!_regex.test(action.payload.endpoint)) {
                return list;
            }

            return action.payload.data.reduce((result, item) => {

                if (item.type !== 'projects') {
                    return result;
                }

                result = [ ...result, project(item, action) ];

                return result;
            }, []);

        default:
            return list;
    }
}
