<template xmlns:v-on="http://www.w3.org/1999/xhtml">

    <div class="project-list">

        <template v-if="has_projects">

            <common-list :data="projects"
                         label-field="name"
                         :on-select="_onProjectSelection"></common-list>

        </template>

        <template v-else>
            <div class="no-results">no projects</div>
        </template>

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
                selected_project: null,
                selected_project_unique_id: null,
                has_projects: false,
                projects: []
            };
        },

        methods: {

            // ------------------------------------
            // handlers
            // ------------------------------------

            _onProjectSelection: function (project) {
                store.dispatch(ProjectActions.selectProject(project));
                store.dispatch(TaskActions.fetchTasks(this.selected_project));
            },

            // ----------------------
            // utils
            // ----------------------

            _updateView: function () {

                const _state            = store.getState();

                // state data
                this.projects           = _state.projects;
                this.selected_project   = _state.selected_project;

                // computed data
                this.has_projects       = this.projects.length > 0;
                this.selected_project_unique_id = this.selected_project !== null ? this.selected_project.unique_id : null;
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
