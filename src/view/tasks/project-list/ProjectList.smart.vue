<template xmlns:v-on="http://www.w3.org/1999/xhtml">

    <div class="project-list">

        <div class="controls project-controls bordered">
            <div class="control-group">
                <div class="control control-left">

                    <button class="add-task-button"
                            v-on:click="_onNewProject()"
                            :disabled="is_editing_project">
                        <span class="label">NEW PROJECT</span>
                        <i class="fa fa-plus" aria-hidden="true"></i>
                    </button>

                </div>
                <div class="control control-right">

                    <button v-on:click="_onRefreshProjects()">
                        <span class="label">REFRESH PROJECTS</span>
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>

                </div>
            </div>
        </div>

        <common-list v-show="has_projects"
                     :data="projects"
                     label-field="name"
                     :selected-unique-id="selected_project_local_id"
                     :on-blur="_onProjectUpdate"
                     :on-edit="_onProjectEdit"
                     :on-select="_onProjectSelection"
        ></common-list>

        <div v-show="!has_projects" class="no-results">no projects</div>

    </div>
</template>

<script type="text/babel">
    // smart component (this means it interacts with application state)

    // actions
    import * as ProjectActions from 'state/projects/project.actions';
    import * as TaskActions from 'state/tasks/task.actions';

    // store
    import { store } from 'state/store';

    // comps
    import CommonList from 'view/common/common-list/CommonList.dumb';

    export default {

        components: { CommonList },

        data: function () {
            return {
                has_projects: false,
                is_editing_project: false,
                projects: [],
                selected_project: null,
                selected_project_local_id: null,
                user: null
            };
        },

        methods: {

            // ------------------------------------
            // handlers
            // ------------------------------------

            _onNewProject: function () {
                store.dispatch(ProjectActions.makeProject());
            },

            _onProjectSelection: function (project) {
                store.dispatch(ProjectActions.selectProject(project));
                store.dispatch(TaskActions.fetchTasks(this.selected_project.server_id));
            },

            _onProjectEdit: function (project) {
                this.is_editing_project = true;
            },

            _onProjectUpdate: function (project, key, value, prev_value) {

                this.is_editing_project = false;

                // if edited value is now invalid
                if (value === "") {

                    // ... and no valid previous value is available remove item before it is stored
                    if (prev_value === "") {
                        return store.dispatch(ProjectActions.removeProject(project));
                    }
                    // ... but a valid previous value is available, then revert to previous value
                    else {
                        return store.dispatch(ProjectActions.updateProjectLocally(project, { [ key ]: prev_value }));
                    }
                }

                // if edited value is unchanged
                // ... do nothing
                if (value === prev_value) {
                    return;
                }

                // edited value is valid
                // ... and already has a server id
                if (project.hasOwnProperty('server_id')) {
                    store.dispatch(ProjectActions.updateProject(project));
                }
                // ... but has no server id
                else {
                    store.dispatch(ProjectActions.createProject(project, project.local_id));
                }
            },

            _onRefreshProjects: function () {
                store.dispatch(ProjectActions.refreshProjects(this.user.server_id));
            },

            // ----------------------
            // utils
            // ----------------------

            _updateView: function () {

                const _state            = store.getState();

                // state data
                this.projects           = _state.projects;
                this.selected_project   = _state.selected_project;
                this.user               = _state.user;

                // computed data
                this.selected_project_local_id = this.selected_project !== null ? this.selected_project.local_id : null;
                this.has_projects       = this.projects.length > 0;
            }
        },

        created: function () {
            store.subscribe(this._updateView.bind(this));
            this._updateView();
        }
    };
</script>

<style scoped lang='scss'>
    @import '../../../styles/view/projects/project-list.scss';
</style>
