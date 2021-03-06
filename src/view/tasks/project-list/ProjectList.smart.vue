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

                    <button v-on:click="_onRefreshProjects()"
                            :class="{ 'disabled': is_refreshing, 'active': !is_refreshing }">
                        <span class="label">REFRESH PROJECTS</span>
                        <i class="fa fa-refresh" :class="{ 'fa-spin': is_refreshing }" aria-hidden="true"></i>
                    </button>

                </div>
            </div>
        </div>

        <common-list v-show="has_projects"
                     :data="projects"
                     label-field="name"
                     :selected-uuid="selected_project_uuid"
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
    import * as project_actions from 'state/projects/project.actions';
    import * as task_actions from 'state/tasks/task.actions';
    import * as storage_actions from 'state/storage/storage.actions';

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
                is_refreshing: false,
                projects: [],
                selected_project: null,
                selected_project_uuid: null,
                user: null
            };
        },

        methods: {

            // ------------------------------------
            // handlers
            // ------------------------------------

            _onNewProject: function () {
                store.dispatch(task_actions.resetTextFilter());
                store.dispatch(task_actions.resetStatusFilter());
                store.dispatch(project_actions.makeProject());
            },

            _onProjectSelection: function (project) {
                store.dispatch(task_actions.resetTextFilter());
                store.dispatch(task_actions.resetStatusFilter());
                store.dispatch(project_actions.selectProject(project));
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
                        return store.dispatch(project_actions.removeProject(project.uuid));
                    }
                    // ... but a valid previous value is available, then revert to previous value
                    else {
                        return store.dispatch(storage_actions.update(project, { [ key ]: prev_value }));
                    }
                }

                // if edited value is unchanged
                // ... do nothing
                if (value === prev_value) {
                    return;
                }

                // edited value is valid
                // ... store or update project
                store.dispatch(storage_actions.storeOrUpdate(project, { 'owner': this.user }));

                // select project
                store.dispatch(project_actions.selectProject(project));
            },

            _onRefreshProjects: function () {
                this.is_refreshing = true;
                store.dispatch(project_actions.refreshProjects(this.user.server_id));
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

                this.is_refreshing      = _state.app.is_refreshing_projects;

                // computed data
                this.selected_project_uuid = this.selected_project !== null ? this.selected_project.uuid : null;
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
