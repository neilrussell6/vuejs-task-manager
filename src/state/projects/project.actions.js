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

// utils
import * as StorageUtils from 'utils/storage/storage.utils';

// local
import * as constants from './project.constants';

// ==============================================
// local storage
// ==============================================

// --------------------------
// item
// --------------------------

export function storeOrUpdateProject (project, user) {
    return function (dispatch) {

        return StorageUtils.validate(project).then(() => {

            const _resource_object = project.resource_object;

            return StorageUtils.view(_resource_object.type, _resource_object.id).then((response) => {

                // is not in storage

                if (typeof response === 'undefined') {
                    return dispatch(storeProject(project, user));
                }

                // is in storage

                return dispatch(updateProject(project));

            }).catch(Promise.reject);
        }).catch(Promise.reject);
    };
}

export function storeProject (project, user) {
    return function (dispatch) {

        return StorageUtils.validate(project).then(() => {

            const _relationships = { user_uuid: user.uuid };
            return StorageUtils.store(project, _relationships).then((uuid) => {

                dispatch({
                    type: constants.ACTION_STORED_PROJECT,
                    project
                });

            }).catch(Promise.reject);
        }).catch(Promise.reject);
    };
}

export function updateProject (project, data = {}) {
    return function (dispatch) {

        Promise.all([ StorageUtils.validate(project), StorageUtils.update(project, data) ]).then((uuid) => {

            dispatch({
                type: constants.ACTION_UPDATED_PROJECT,
                project,
                data
            });

        }).catch(Promise.reject);
    };
}

// --------------------------
// collection
// --------------------------

export function refreshProjects (user) {
    return fetchProjects(user);
}

export function fetchProjects (user) {
    return function (dispatch) {

        return StorageUtils.index('projects').then((projects) => {

            dispatch({
                type: constants.ACTION_INDEXED_PROJECTS,
                data: projects
            });

        }).catch(Promise.reject);
    };
}

// ==============================================
// state
// ==============================================

// --------------------------
// item
// --------------------------

export function deselectProject () {
    return {
        type:    constants.ACTION_DESELECT_PROJECT
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

export function selectProject (project) {
    return function (dispatch) {

        dispatch({
            type:   constants.ACTION_SELECT_PROJECT,
            data:   project
        });

        dispatch(TaskActions.fetchTasks(project));
    };
}
