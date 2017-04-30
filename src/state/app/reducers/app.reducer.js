// data
import { ARTIFICIAL_DELAY } from 'data/app.settings';

// state
import * as storage_constants from 'state/storage/storage.constants';
import * as project_constants from 'state/projects/project.constants';
import * as task_constants from 'state/tasks/task.constants';
import * as user_constants from 'state/user/user.constants';

// local
import * as app_constants from '../app.constants';

// ---------------------------
// public
// ---------------------------

export function app (state = app_constants.DEFAULT_STATE, action) {

    switch (action.type) {

        // ---------------------------
        // app
        // ---------------------------

        case app_constants.ACTION_TOGGLE_SHOW_LOGIN:
            return Object.assign({}, state, { show_login: state.show_login ? false : true });

        case app_constants.ACTION_WORK_OFFLINE:
            return Object.assign({}, state, { is_offline: true });

        // ---------------------------
        // API
        // ---------------------------

        case storage_constants.ACTION_STORAGE_WILL_SYNC:
            return Object.assign({}, state, { is_disabled: true });

        case storage_constants.ACTION_STORAGE_SYNCED:
            return Object.assign({}, state, { is_disabled: false });

        case storage_constants.ACTION_STORAGE_ERROR_CONNECTION:
            return Object.assign({}, state, { is_refreshing_projects: false, is_offline: true });

        // ---------------------------
        // projects
        // ---------------------------

        // case project_constants.ACTION_STORAGE_LOCAL_INDEXED_PROJECTS:
        //     return Object.assign({}, state, { is_refreshing_projects: true });

        case storage_constants.ACTION_STORAGE_SERVER_INDEXED:
            return Object.assign({}, state, { is_refreshing_projects: false });

        // ---------------------------
        // tasks
        // ---------------------------

        case task_constants.ACTION_INDEXED_TASKS:
            return Object.assign({}, state, { is_refreshing_tasks: true });

        case task_constants.STORAGE_SERVER_ACTION_INDEXED_TASKS:
            return Object.assign({}, state, { is_refreshing_tasks: false });

        // ---------------------------
        // user
        // ---------------------------

        case user_constants.ACTION_USER_AUTHENTICATED:
            return Object.assign({}, state, { show_login: false });

        case user_constants.ACTION_TOKEN_EXPIRED:
            return Object.assign({}, state, { show_login: true });

        default:
            return state;
    }
}
