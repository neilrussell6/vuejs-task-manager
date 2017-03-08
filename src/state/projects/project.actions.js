import {
    API_READ_FAILED,
    readEndpoint
} from 'redux-json-api';

// local
import { ACTION_SELECT_PROJECT } from './project.constants';

// --------------------------
// tasks : list
// --------------------------

export function selectProject (data) {
    return {
        type:    ACTION_SELECT_PROJECT,
        data:    data
    };
}

// --------------------------
// projects : fetch
// --------------------------

export function refreshProjects () {
    return fetchProjects();
}

export function fetchProjects () {
    return function (dispatch) {
        const _endpoint = 'users/1/projects';

        dispatch(readEndpoint(_endpoint))
            .catch(() => {
                dispatch(API_READ_FAILED);
            });
    };
}

