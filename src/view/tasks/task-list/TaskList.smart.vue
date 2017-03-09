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

                    <button v-on:click="_onRefreshTasks()" :disabled="selected_project === null">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>

                </div>
            </div>
        </div>

        <div class="task-list">

            <template v-if="has_tasks">

                <template v-if="status_filter === STATUS_FILTER_TYPE.TRASH">
                    <common-table :data="filtered_tasks"
                                  :cell-configs="tasks_trash_table_cell_configs"
                                  :use-default-headings.once="false"
                                  :data-keys.once="tasks_trash_table_keys"
                    ></common-table>
                </template>

                <template v-else>
                    <common-table :data="filtered_tasks"
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

<script type="text/babel">
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
    import { store } from 'state/store';

    // settings
    import { TASK_STATUS } from 'data/models/crud/jsonapi/task.model';
    import { STATUS_FILTER_TYPE } from 'data/models/basic/status-filter.model';

    // utils
    import * as StatusFilterUtils from 'utils/status-filter/status-filter.utils';
    import * as TextFilterUtils from 'utils/text-filter/text-filter.utils';

    let _vm;

    export default {

        components: {
            CommonTable,
            CommonList,
            StatusFilter,
            TextFilter
        },

        computed: {
            filtered_tasks() {
                let result = this.tasks;
                result = StatusFilterUtils.filterTasks(result, this.status_filter);
                result = TextFilterUtils.filterTasks(result, this.text_filter);
                return result;
            }
        },

        data: function () {
            return {
                status_filter: '',
                selected_project: null,
                has_tasks: false,
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
                store.dispatch(TaskActions.makeTask());
            },

            _onRefreshTasks: function () {

                if (this.selected_project === null) {
                    return;
                }

                store.dispatch(TaskActions.refreshTasks(this.selected_project));
            },

            // ------------------------------------
            // handlers : common-table : tasks
            // ------------------------------------

            _onUpdateTask: function (task) {
                console.log("_onUpdateTask");
                store.dispatch(TaskActions.updateTask(task));
            },

            _onTrashTask: function (task) {
                store.dispatch(TaskActions.trashTask(task));
            },

            _onToggleTaskComplete: function (task) {
                store.dispatch(TaskActions.toggleTaskComplete(task));
            },

            // ------------------------------------
            // handlers : common-table : trash tasks
            // ------------------------------------

            _onDeleteTask: function (task) {
                store.dispatch(MessageActions.requestDeleteConfirmation(task, (is_confirmed) => {
                    if (is_confirmed) {
                        store.dispatch(TaskActions.deleteTask(task));
                    } else {
                        store.dispatch(MessageActions.cancelDelete());
                    }
                }));
            },

            _onUndoTrashTask: function (task) {
                store.dispatch(TaskActions.undoTrashTask(task));
            },

            // ------------------------------------
            // handlers : text-filter
            // ------------------------------------

            _onTextFilterUpdate: function (term) {
                store.dispatch(TaskActions.setTextFilter(term));
            },

            // ------------------------------------
            // handlers : status-filter
            // ------------------------------------

            _onStatusFilterSelection: function (filter_type) {
                store.dispatch(TaskActions.setStatusFilter(filter_type));
            },

            // ----------------------
            // utils
            // ----------------------

            _updateView: function () {

                const _state            = store.getState();

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
                this.has_tasks          = _state.tasks.length > 0;

                if (_should_fetch_tasks) {
                    store.dispatch(TaskActions.fetchTasks(this.selected_project));
                }
            }
        },

        created: function () {
            _vm = this;
            store.subscribe(this._updateView.bind(this));
            this._updateView();
        }
    };
</script>

<style lang='scss'>
    @import '../../../styles/view/tasks/task-list.scss';
</style>
