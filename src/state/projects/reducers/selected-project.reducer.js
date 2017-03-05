// app
import { Project } from 'data/models/basic/project.model';

// local
import {
    ACTION_SELECT_PROJECT,
    DEFAULT_SELECTED_PROJECT_STATE
} from '../project.settings';

export function selected_project (state = DEFAULT_SELECTED_PROJECT_STATE, action) {

    switch (action.type) {

        case ACTION_SELECT_PROJECT:
            return new Project(action.data);

        default:
            return state;
    }
}

