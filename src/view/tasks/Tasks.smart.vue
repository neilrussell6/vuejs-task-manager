<template>
    <div class="body" :class="{'project-selected': is_project_selected}">

        <div class="column column-left bordered">
            <project-list></project-list>
        </div>

        <div class="column column-right bordered">
            <task-list></task-list>
        </div>
    </div>
</template>

<script type="text/babel">
    // smart component (this means it interacts with application state)

    // actions
    import * as task_actions from 'state/tasks/task.actions';

    // components
    import ProjectList from './project-list/ProjectList.smart';
    import TaskList from './task-list/TaskList.smart';

    // store
    import { store } from 'state/store';

    export default {

        components: {
            ProjectList,
            TaskList
        },

        data: function () {
            return {
                is_project_selected: false
            };
        },

        methods: {
            _updateView: function () {
                const _state = store.getState();
                this.is_project_selected = _state.selected_project !== null;
            }
        },

        created: function () {
            store.subscribe(this._updateView.bind(this));
        }
    };
</script>

<style scoped lang='scss'>
    @import '../../styles/view/tasks/tasks.scss';
</style>
