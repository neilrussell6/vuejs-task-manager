import {
    API_CREATE_FAILED,
    API_DELETE_FAILED,
    API_READ_FAILED,
    API_UPDATE_FAILED,
    createResource,
    deleteResource,
    readEndpoint,
    updateResource
} from 'redux-json-api';

// actions
import * as TaskActions from 'state/tasks/task.actions';

// data
import { JsonApiModel } from 'data/models/jsonapi.model';
import { Project } from 'data/models/crud/jsonapi/project.model';

// local
import * as constants from './project.constants';

// --------------------------
// project
// --------------------------

export function createProject (project, project_local_id) {
    return function (dispatch) {

        if (!(project instanceof JsonApiModel) || project.resource_object === null) {
            throw new Error("Invalid model");
        }

        dispatch(createResource(project.resource_object))
            .then((response) => {
                let _data = Object.assign({}, response.data.attributes, { local_id: project_local_id }, { id: response.data.id });
                dispatch(selectProject(_data));
                dispatch(TaskActions.fetchTasks(response.data.id));
            })
            .catch(() => {
                dispatch(API_CREATE_FAILED);
            });
    };
}

export function deleteProject (project) {
    return function (dispatch) {

        if (!(project instanceof JsonApiModel) || project.resource_identifier_object === null) {
            throw new Error("Invalid model");
        }

        dispatch(deleteResource(project.resource_identifier_object))
            .catch(() => {
                dispatch(API_DELETE_FAILED);
            });
    };
}

export function makeProject () {
    return {
        type: constants.ACTION_MAKE_PROJECT
    };
}

export function removeProject (project) {
    return {
        type: constants.ACTION_REMOVE_PROJECT,
        project
    };
}

export function deselectProject () {
    return {
        type:    constants.ACTION_DESELECT_PROJECT
    };
}

export function selectProject (data) {
    return {
        type:    constants.ACTION_SELECT_PROJECT,
        data:    data
    };
}

export function updateProject (project) {
    return function (dispatch) {

        if (!(project instanceof JsonApiModel) || project.resource_object === null) {
            throw new Error("Invalid model");
        }

        dispatch(updateResource(project.resource_object))
            .catch(() => {
                dispatch(API_UPDATE_FAILED);
            });
    };
}

// --------------------------
// projects
// --------------------------

export function refreshProjects (user_id) {
    return fetchProjects(user_id);
}

export function fetchProjects (user_id) {
    return function (dispatch) {
        const _endpoint = `users/${user_id}/projects`;

        dispatch(readEndpoint(_endpoint))
            .catch(() => {
                dispatch(API_READ_FAILED);
            });
    };
}
