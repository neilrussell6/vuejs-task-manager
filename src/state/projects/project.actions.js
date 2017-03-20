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

export function destroyProject (project, user) {
    return function (dispatch) {

        return StorageUtils.validate(project).then(() => {

            const _resource_object = project.resource_object;

            // destroy on local storage
            return StorageUtils.destroy(_resource_object.type, _resource_object.id).then(() => {

                dispatch({
                    type: constants.ACTION_DESTROYED_PROJECT,
                    project
                });

                // if user is not authenticated
                if (!user.is_authenticated) {
                    return;
                }

                // destroy on server
                dispatch(deleteResource(project.resource_identifier_object))
                    .catch(() => {
                        dispatch(API_DELETE_FAILED);
                    });

            }).catch(Promise.reject);
        }).catch(Promise.reject);
    };
}

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

            // store in local storage
            const _relationships = { user_uuid: user.uuid };
            return StorageUtils.store(project, _relationships).then((uuid) => {

                dispatch({
                    type: constants.ACTION_STORED_PROJECT,
                    project
                });

                // if user is not authenticated
                if (!user.is_authenticated) {
                    return;
                }

                // store on server
                dispatch(createResource(project.resource_object))
                    .then((response) => {
                        let _data = Object.assign({}, response.data.attributes, { local_id: project_local_id }, { id: response.data.id });
                        dispatch(selectProject(_data));
                        dispatch(TaskActions.fetchTasks(response.data.id));
                    })
                    .catch(() => {
                        dispatch(API_CREATE_FAILED);
                    });

            }).catch(Promise.reject);
        }).catch(Promise.reject);
    };
}

export function updateProject (project, data = {}, user) {
    return function (dispatch) {

        // update in local storage
        Promise.all([ StorageUtils.validate(project), StorageUtils.update(project, data) ]).then((uuid) => {

            dispatch({
                type: constants.ACTION_UPDATED_PROJECT,
                project,
                data
            });

            // if user is not authenticated
            if (!user.is_authenticated) {
                return;
            }

            // update on server
            dispatch(updateResource(project.resource_object))
                .catch(() => {
                    dispatch(API_UPDATE_FAILED);
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

        // index from local storage
        return StorageUtils.index('projects').then ((projects) => {

            dispatch({
                type: constants.ACTION_INDEXED_PROJECTS,
                data: projects
            });

            // if user is not authenticated
            if (!user.is_authenticated) {
                return;
            }

            // index from server
            const _endpoint = `users/${user.uuid}/projects`;

            dispatch(readEndpoint(_endpoint))
                .then(
                    (response) => {

                        const _data = response.payload.data;

                        // update many in local storage
                        return StorageUtils.updateMany('projects').then ((projects) => {

                        });
                    }
                )
                .catch(() => {
                    dispatch(API_READ_FAILED);
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
