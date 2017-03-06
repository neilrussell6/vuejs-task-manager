// import { readEndpoint } from 'redux-json-api';

// local
import { ACTION_SELECT_PROJECT } from './project.settings';

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
        console.log("FETCH PROJECTS");
        // dispatch(readEndpoint('users/1/projects'));
    };
}

