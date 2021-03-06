// data
import { Project } from 'data/models/crud/jsonapi/project.model';

// state
import * as storage_constants from 'state/storage/storage.constants';

// local
import * as constants from '../project.constants';

export function selected_project (state = constants.DEFAULT_SELECTED_PROJECT_STATE, action) {

    switch (action.type) {

        // ---------------------------
        // selected project
        // ---------------------------

        case constants.ACTION_SELECT_PROJECT:
            return new Project(action.resource);

        case constants.ACTION_DESELECT_PROJECT:
            return constants.DEFAULT_SELECTED_PROJECT_STATE;
        
        // ---------------------------

        default:
            return state;
    }
}

