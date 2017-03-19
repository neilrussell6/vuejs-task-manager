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
import * as StorageActions from 'state/storage/storage.actions';

// data
import { JsonApiModel } from 'data/models/jsonapi.model';
import { Project } from 'data/models/crud/jsonapi/project.model';

// state
import * as common_constants from 'state/common.constants';

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as constants from './project.constants';

// --------------------------
// project
// --------------------------

export function storeOrUpdateProject (project, user) {
    return function (dispatch) {

        return StorageUtils.validate(project).then(() => {

            // get item from local storage
            const _resource_object = project.resource_object;

            return StorageUtils.view(_resource_object.type, _resource_object.id).then((response) => {

                // project is not in storage
                if (typeof response === 'undefined') {

                    console.log("CREATE");

                    const _relationships = { user_id: user.uuid };
                    return StorageUtils.store(project, _relationships);
                }

                // project is in storage

                console.log("UPDATE");
                const _existing_project = new Project(response);

                // ... if project is unchanged
                if (JSON.stringify(_existing_project.resource_object) === JSON.stringify(project.resource_object)) {
                    return Promise.resolve(_existing_project);
                }

                // .. if project is changed
                return StorageUtils.update(project);

            }).catch((message) => console.log("MESSAGE A ", message));
        }).catch((message) => console.log("MESSAGE A ", message));


        // if (!(project instanceof JsonApiModel) || project.resource_object === null) {
        //     throw new Error("Invalid model");
        // }
        //
        // dispatch(createResource(project.resource_object))
        //     .then((response) => {
        //         let _data = Object.assign({}, response.data.attributes, { local_id: project_local_id }, { id: response.data.id });
        //         dispatch(selectProject(_data));
        //         dispatch(TaskActions.fetchTasks(response.data.id));
        //     })
        //     .catch(() => {
        //         dispatch(API_CREATE_FAILED);
        //     });
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

export function makeProject (data = {}) {
    return {
        type: constants.ACTION_MAKE_PROJECT,
        data
    };
}

export function removeProject (uuid) {
    return {
        type: constants.ACTION_REMOVE_PROJECT,
        uuid
    };
}

export function deselectProject () {
    return {
        type:    constants.ACTION_DESELECT_PROJECT
    };
}

export function selectProject (project) {
    return function (dispatch) {
        dispatch({
            type:   constants.ACTION_SELECT_PROJECT,
            data:   project
        });

        dispatch(TaskActions.fetchTasks(project));
    };
}

export function updateProject (project) {
    return function (dispatch) {

        // dispatch(StorageActions.update(project));
        //
        // if (!(project instanceof JsonApiModel) || project.resource_object === null) {
        //     throw new Error("Invalid model");
        // }
        //
        // dispatch(updateResource(project.resource_object))
        //     .catch(() => {
        //         dispatch(API_UPDATE_FAILED);
        //     });
    };
}

export function updateLocalProject (project, data) {
    return {
        type: constants.ACTION_UPDATE_PROJECT_LOCALLY,
        project,
        data
    };
}

// --------------------------
// projects
// --------------------------

export function refreshProjects (user) {
    return fetchProjects(user);
}

export function fetchProjects (user) {
    return function (dispatch) {

        // get projects from local storage
        return StorageUtils.index('projects').then((projects) => {
            dispatch({
                type: constants.ACTION_FETCHED_PROJECTS,
                data: projects
            });
        });
    };
}
