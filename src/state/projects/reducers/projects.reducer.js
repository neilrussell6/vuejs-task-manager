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
// private
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
        // state
        // ---------------------------

        case project_constants.ACTION_MAKE_PROJECT:
            return new Project(Object.assign({}, action.data, { uuid: StorageUtils.makeUUID() }));

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
