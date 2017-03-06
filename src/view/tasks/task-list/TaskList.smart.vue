<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div>
        <div class="task-controls">
            <div class="task-control-group">
                <div class="task-control">

                    <text-filter :on-change="_onTextFilterUpdate"></text-filter>

                </div>
                <div class="task-control right">

                    <status-filter class="status-filter"
                                   :selected-status-filter="status_filter"
                                   :on-select="_onStatusFilterSelection"
                    ></status-filter>

                </div>
            </div>
            <div class="task-control-group">
                <div class="task-control">

                    <button class="add-task-button" v-on:click="_onNewTask">
                        <i class="fa fa-plus" aria-hidden="true"></i>
                    </button>

                </div>
                <div class="task-control right">

                    <button v-on:click="_onRefreshTasks()">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>

                    <button v-on:click="_onToggleView()">

                        <template v-if="is_list_view">
                            <i class="fa fa-align-justify" aria-hidden="true"></i>
                        </template>

                        <template v-else>
                            <i class="fa fa-th" aria-hidden="true"></i>
                        </template>

                    </button>

                </div>
            </div>
        </div>

        <div class="task-list">

            <template v-if="has_tasks">

                <template v-if="status_filter === STATUS_FILTER_TYPE.TRASH">
                    <!--<common-table :table-data="tasks | text text_filter | complete status_filter"-->
                    <common-table :table-data="tasks"
                                  :cell-configs="tasks_trash_table_cell_configs"
                                  :use-default-headings.once="false"
                                  :data-keys.once="tasks_trash_table_keys"
                    ></common-table>
                </template>

                <template v-else>
                    <common-table :data="tasks | text text_filter | complete status_filter"
                                  :cell-configs="tasks_table_cell_configs"
                                  :use-default-headings.once="false"
                                  :data-keys.once="tasks_table_keys"
                    ></common-table>
                </template>

            </template>

            <template v-else>
                <div class="no-results">no results</div>
            </template>

        </div>
    </div>
</template>

<script>
    // smart component (this means it interacts with application state)

    // actions
    import * as MessageActions from 'state/message/message.actions';
    import * as TaskActions from 'state/tasks/task.actions';

    // components
    import CommonList from 'view/common/common-list/CommonList.dumb';
    import CommonTable from 'view/common/common-table/CommonTable.dumb';
    import StatusFilter from './status-filter/StatusFilter.dumb';
    import TextFilter from './text-filter/TextFilter.dumb';

    // store
    import { Store } from 'state/store';

    // settings
    import { TASK_STATUS } from 'data/models/basic/task.model';
    import { STATUS_FILTER_TYPE } from 'data/models/basic/status-filter.model';

    let _vm;

    export default {

        components: {
            CommonTable,
            CommonList,
            StatusFilter,
            TextFilter
        },

        data: function () {
            return {
                status_filter: '',
                selected_project: null,
                has_tasks: false,
                is_list_view: false,
                tasks: [],
                tasks_table_cell_configs: {
                    name: {
                        type: 'inline-edit',
                        blurHandler: this._onUpdateTask,
                        canEdit: function (data) {
                            return data.status === 1;
                        },
                        conditionalClass: function (data, editing_item_unique_id) {
                            return {
                                'complete': data.status === TASK_STATUS.COMPLETE,
                                'editing': data.unique_id === editing_item_unique_id
                            };
                        }
                    },
                    complete: {
                        type: 'button',
                        icon_class: [ 'fa fa-check-square', 'fa fa-square' ],
                        iconClassIndex: function (data) {
                            return data.status === TASK_STATUS.COMPLETE ? 0 : 1;
                        },
                        clickHandler: this._onToggleTaskComplete,
                        isDisabled: function (data) {
                            return false;
                        }
                    },
                    trash: {
                        type: 'button',
                        icon_class: 'fa fa-trash',
                        clickHandler: this._onTrashTask,
                        isDisabled: function (data) {
                            return data.status === TASK_STATUS.INCOMPLETE;
                        }
                    }
                },
                tasks_table_keys: ['name', 'complete', 'trash'],
                tasks_trash_table_cell_configs: {
                    undo: {
                        type: 'button',
                        icon_class: 'fa fa-undo',
                        clickHandler: this._onUndoTrashTask
                    },
                    delete: {
                        type: 'button',
                        icon_class: 'fa fa-remove',
                        clickHandler: this._onDeleteTask
                    }
                },
                tasks_trash_table_keys: ['name', 'undo', 'delete'],
                text_filter: ''
            };
        },

        methods: {

            // ------------------------------------
            // handlers : controls
            // ------------------------------------

            _onNewTask: function () {
                Store.store.dispatch(TaskActions.makeTask());
            },

            _onRefreshTasks: function () {
                Store.store.dispatch(TaskActions.refreshTasks());
            },

            _onToggleView: function () {
                this.is_list_view = !this.is_list_view;
            },

            // ------------------------------------
            // handlers : common-table : tasks
            // ------------------------------------

            _onUpdateTask: function (task) {
                Store.store.dispatch(TaskActions.updateTask(task.unique_id, task));
            },

            _onTrashTask: function (task) {
                Store.store.dispatch(TaskActions.trashTask(task.unique_id));
            },

            _onToggleTaskComplete: function (task) {
                Store.store.dispatch(TaskActions.toggleTaskComplete(task.unique_id));
            },

            // ------------------------------------
            // handlers : common-table : trash tasks
            // ------------------------------------

            _onDeleteTask: function (task) {
                Store.store.dispatch(MessageActions.requestDeleteConfirmation(task));
            },

            _onUndoTrashTask: function (task) {
                Store.store.dispatch(TaskActions.undoTrashTask(task.unique_id));
            },

            // ------------------------------------
            // handlers : text-filter
            // ------------------------------------

            _onTextFilterUpdate: function (term) {
                Store.store.dispatch(TaskActions.setTextFilter(term));
            },

            // ------------------------------------
            // handlers : status-filter
            // ------------------------------------

            _onStatusFilterSelection: function (filter_type) {
                Store.store.dispatch(TaskActions.setStatusFilter(filter_type));
            },

            // ----------------------
            // utils
            // ----------------------

            _updateView: function () {

                const _state            = Store.store.getState();

                // actions
                let _should_fetch_tasks = _state.selected_project !== null && (this.selected_project === null || _state.selected_project.unique_id !== this.selected_project.unique_id);

                // settings
                this.STATUS_FILTER_TYPE = STATUS_FILTER_TYPE;

                // state data
                this.selected_project   = _state.selected_project;
                this.status_filter      = _state.tasks_status_filter;
                this.tasks              = _state.tasks;
                this.text_filter        = _state.tasks_text_filter;

                // computed data
                this.has_tasks              = _state.tasks.length > 0;

                if (_should_fetch_tasks) {
                    Store.store.dispatch(TaskActions.fetchTasks(this.selected_project));
                }
            }
        },

        ready: function () {
            _vm = this;
            Store.store.subscribe(this._updateView.bind(this));
            this._updateView();
        }
    };
</script>

<style lang='scss'>
    @import '../../../styles/view/tasks/task-list.scss';
</style>
