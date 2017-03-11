<template>
    <div class="body">

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
    import * as TaskActions from 'state/tasks/task.actions';

    // components
    import ProjectList from './project-list/ProjectList.smart';
    import TaskList from './task-list/TaskList.smart';

    // store
    import { store } from 'state/store';

    export default {

        components: {
            ProjectList,
            TaskList
        }
    };
</script>

<style scoped lang='scss'>
    @import '../../styles/view/tasks/tasks.scss';
</style>
