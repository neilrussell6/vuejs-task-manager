<template>
    <div class="app-container task-app">

        <div>
            <common-message :message="message"></common-message>
        </div>

        <div class="app-columns">
            <div class="app-column app-column-left">
                <project-list></project-list>
            </div>

            <div class="app-column app-column-right">
                <task-list></task-list>
            </div>
        </div>

    </div>
</template>

<script>
    // smart component (this means it interacts with application state)

    import * as MessageUtils from 'state/message/message.utils';

    // settings
    import { ACTION_REQUEST_DELETE_CONFIRMATION } from 'state/message/message.settings';

    // actions
    import * as MessageActions from 'state/message/message.actions';
    import * as ProjectsActions from 'state/projects/project.actions';
    import * as TaskActions from 'state/tasks/task.actions';

    // components
    import CommonMessage from 'view/common/common-message/CommonMessage.dumb';
    import ProjectList from './project-list/ProjectList.smart';
    import TaskList from './task-list/TaskList.smart';

    // store
    import { Store } from 'state/store';

    let _vm;

    export default {

        components: {
            CommonMessage,
            ProjectList,
            TaskList
        },

        data: function () {
            return {
                selected_project: null,
                tasks: [],
                message: null,
                previous_message: null
            };
        },

        methods: {

            // ------------------------------------
            // handlers: message
            // ------------------------------------

            _messageButtonClickHandler: function (button, action) {

                if (action.type === ACTION_REQUEST_DELETE_CONFIRMATION) {
                    if (button.value) {
                        Store.store.dispatch(MessageActions.confirmDelete(action.data.unique_id));
                    } else {
                        Store.store.dispatch(MessageActions.cancelDelete());
                    }
                }
            },

            // ------------------------------------
            // handlers: task-editor
            // ------------------------------------

            _onEditorAddOrUpdate: function () {
                if (this.editing_task.local_id === null) {
                    Store.store.dispatch(TaskActions.addTask(this.tasks, this.editing_task));
                } else {
                    Store.store.dispatch(TaskActions.updateTask(this.editing_task.unique_id, this.editing_task));
                }
                Store.store.dispatch(TaskActions.unsetEditingTask());
            },

            _onEditorCancel: function () {
                Store.store.dispatch(TaskActions.unsetEditingTask());
            },

            // ----------------------
            // utils
            // ----------------------

            _updateView: function () {
                const _state            = Store.store.getState();

                // if unset message
                if (_state.message === null) {
                    this.message            = null;
                    this.previous_message   = null;
                }
                // if new message
                else if (_state.message !== this.previous_message && _state.message !== null) {

                    _state.message.label = MessageUtils.populateMessageLabelVars(_state.message.label, _state, 'name');

                    this.message            = _state.message;
                    this.previous_message   = _state.message;

                    if (this.message.expire) {
                        window.setTimeout(function () {
                            _vm.message = null;
                        }, this.message.expire);
                    }

                    if (this.message.hasOwnProperty('buttons')) {
                        this.message.clickHandler = this._messageButtonClickHandler.bind(this);
                    }
                }
            }
        },

        ready: function () {
            _vm = this;
            Store.store.subscribe(this._updateView.bind(this));
            Store.store.dispatch(ProjectsActions.refreshProjects());
        }
    };
</script>

<style scoped lang='scss'>
    @import '../../styles/view/tasks/tasks.scss';
</style>
