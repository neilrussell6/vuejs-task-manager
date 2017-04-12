<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="task-list">

        <!-- controls -->
        <div class="controls task-controls bordered">

            <!-- controls -->
            <div class="control-group">
                <div class="control control-left">

                    <text-filter class="text-filter" :on-change="_onTextFilterUpdate" :term="text_filter"></text-filter>

                    <button class="back-button" v-on:click="_onBack()">
                        <i class="fa fa-chevron-left" aria-hidden="true"></i>
                        <span class="label">BACK</span>
                    </button>

                </div>
                <div class="control control-right">

                    <status-filter class="status-filter"
                                   :selected-status-filter="status_filter"
                                   :on-select="_onStatusFilterSelection"
                    ></status-filter>

                    <common-cycle-button class="status-filter-cycle-button"
                                         :data="status_filter_cycle_button_data"
                                         :on-click="_onStatusFilterSelection"
                                         :selected-index="status_filter_cycle_button_index"
                    ></common-cycle-button>

                </div>
            </div>

            <!-- task controls -->
            <div class="control-group">
                <div class="control control-left">

                    <button class="add-task-button"
                            v-on:click="_onNewTask()"
                            :disabled="selected_project === null || is_editing_task">
                        <i class="fa fa-plus" aria-hidden="true"></i>
                        <span class="label">NEW TASK</span>
                    </button>

                </div>
                <div class="control control-right">

                    <button v-on:click="_onRefreshTasks()"
                            :class="{ 'disabled': selected_project === null || is_refreshing === true, 'active': selected_project !== null && is_refreshing === false }">
                        <span class="label">REFRESH TASKS</span>
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>

                </div>
            </div>
        </div>

        <div class="task-list">

            <common-table v-show="has_tasks"
                          :data="filtered_tasks"
                          :config="tasks_table_config"
                          :cell-configs="tasks_table_cell_configs"
                          :use-default-headings.once="false"
                          :data-keys.once="tasks_table_keys"
            ></common-table>

            <div v-show="!has_tasks" class="no-results">no results</div>

        </div>
    </div>
</template>

<script type="text/babel">
    // smart component (this means it interacts with application state)

    // actions
    import * as message_actions from 'state/message/message.actions';
    import * as task_actions from 'state/tasks/task.actions';
    import * as project_actions from 'state/projects/project.actions';
    import * as storage_actions from 'state/storage/storage.actions';

    // components
    import CommonCycleButton from 'view/common/common-cycle-button/CommonCycleButton.dumb';
    import CommonList from 'view/common/common-list/CommonList.dumb';
    import CommonTable from 'view/common/common-table/CommonTable.dumb';
    import StatusFilter from './status-filter/StatusFilter.dumb';
    import TextFilter from './text-filter/TextFilter.dumb';

    // store
    import { store } from 'state/store';

    // data
    import { TASK_STATUS } from 'data/models/crud/jsonapi/task.model';
    import { STATUS_FILTER_TYPE } from 'data/models/basic/status-filter.model';

    // utils
    import * as StatusFilterUtils from 'utils/status-filter/status-filter.utils';
    import * as TextFilterUtils from 'utils/text-filter/text-filter.utils';

    let _vm;

    export default {

        components: {
            CommonCycleButton,
            CommonTable,
            CommonList,
            StatusFilter,
            TextFilter
        },

        data: function () {
            return {
                status_filter_cycle_button_data: [
                    { label: "ALL", value: STATUS_FILTER_TYPE.ALL, icon_class: "fa-star-o" },
                    { label: "INCOMPLETE", value: STATUS_FILTER_TYPE.INCOMPLETE, icon_class: "fa-star-half-o" },
                    { label: "COMPLETE", value: STATUS_FILTER_TYPE.COMPLETE, icon_class: "fa-star" },
                    { label: "TRASH", value: STATUS_FILTER_TYPE.TRASH, icon_class: "fa-trash" }
                ],
                filtered_tasks: [],
                has_tasks: false,
                is_editing_task: false,
                is_refreshing: null,
                selected_project: null,
                status_filter: '',
                tasks: [],
                tasks_table_cell_configs_default: {
                    complete: {
                        type: 'button',
                        icon_class: [ 'fa fa-check-square', 'fa fa-square' ],
                        iconClassIndex: function (data) {
                            return data.status === TASK_STATUS.COMPLETE ? 0 : 1;
                        },
                        onClick: this._onToggleTaskComplete
                    },
                    name: {
                        type: 'inline-edit',
                        onEdit: this._onTaskEdit,
                        onBlur: this._onTaskUpdate,
                        canEdit: function (data) {
                            return data.status === 1;
                        }
                    },
                    trash: {
                        type: 'button',
                        icon_class: 'fa fa-trash',
                        onClick: this._onTrashTask,
                        isDisabled: function (data) {
                            return data.status === TASK_STATUS.INCOMPLETE;
                        }
                    }
                },
                tasks_table_cell_configs_trash: {
                    delete: {
                        type: 'button',
                        icon_class: 'fa fa-remove',
                        onClick: this._onDeleteTask
                    },
                    undo: {
                        type: 'button',
                        icon_class: 'fa fa-undo',
                        onClick: this._onUndoTrashTask
                    }
                },
                tasks_table_config: {
                    // will attach the values of these properties to each row eg. <tr class="status-2">
                    row_class_properties: [ 'status' ]
                },
                tasks_table_keys_default: ['name', 'complete', 'trash'],
                tasks_table_keys_trash: ['name', 'undo', 'delete'],
                text_filter: '',
                user: null
            };
        },

        methods: {

            // ------------------------------------
            // handlers : controls
            // ------------------------------------

            _onBack: function () {
                store.dispatch(project_actions.deselectProject());
            },

            _onNewTask: function () {
                store.dispatch(task_actions.resetTextFilter());
                store.dispatch(task_actions.resetStatusFilter());
                store.dispatch(task_actions.makeTask());
            },

            _onRefreshTasks: function () {

                if (this.selected_project === null) {
                    return;
                }

                store.dispatch(task_actions.refreshTasks(this.selected_project));
            },

            // ------------------------------------
            // handlers : common-table : tasks
            // ------------------------------------

            _onTaskEdit: function (task) {
                this.is_editing_task = true;
            },

            _onTaskUpdate: function (task, key, value, prev_value) {

                this.is_editing_task = false;

                // if edited value is now invalid
                if (value === "") {

                    // ... and no valid previous value is available remove item before it is stored
                    if (prev_value === "") {
                        return store.dispatch(task_actions.removeTask(task.uuid));
                    }
                    // ... but a valid previous value is available, then revert to previous value
                    else {
                        return store.dispatch(storage_actions.update(task, { [ key ]: prev_value }));
                    }
                }

                // if edited value is unchanged
                // ... do nothing
                if (value === prev_value) {
                    return;
                }

                // edited value is valid
                store.dispatch(storage_actions.storeOrUpdate(task, { 'project': this.selected_project, 'owner': this.user }));
            },

            _onToggleTaskComplete: function (task) {
                store.dispatch(task_actions.toggleTaskComplete(task));
            },

            _onTrashTask: function (task) {
                store.dispatch(task_actions.trashTask(task));
            },

            // ------------------------------------
            // handlers : common-table : trash tasks
            // ------------------------------------

            _onDeleteTask: function (task) {
                store.dispatch(message_actions.requestDeleteConfirmation(task, (is_confirmed) => {
                    if (is_confirmed) {
                        store.dispatch(storage_actions.destroy(task));
                    } else {
                        store.dispatch(message_actions.cancelDelete());
                    }
                }));
            },

            _onUndoTrashTask: function (task) {
                store.dispatch(task_actions.undoTrashTask(task));
            },

            // ------------------------------------
            // handlers : text-filter
            // ------------------------------------

            _onTextFilterUpdate: function (term) {
                store.dispatch(task_actions.setTextFilter(term));
            },

            // ------------------------------------
            // handlers : status-filter
            // ------------------------------------

            _onStatusFilterSelection: function (filter_type) {
                store.dispatch(task_actions.setStatusFilter(filter_type));
            },

            // ----------------------
            // utils
            // ----------------------

            _updateView: function () {

                const _state            = store.getState();

                // state data
                this.selected_project   = _state.selected_project;
                this.status_filter      = _state.tasks_status_filter;
                this.tasks              = _state.tasks;
                this.text_filter        = _state.tasks_text_filter;
                this.user               = _state.user;

                // computed data
                this.tasks_table_cell_configs = this.status_filter === STATUS_FILTER_TYPE.TRASH ? this.tasks_table_cell_configs_trash : this.tasks_table_cell_configs_default;
                this.tasks_table_keys   = this.status_filter === STATUS_FILTER_TYPE.TRASH ? this.tasks_table_keys_trash : this.tasks_table_keys_default;
                this.filtered_tasks     = TextFilterUtils.filterTasks(StatusFilterUtils.filterTasks(this.tasks, this.status_filter), this.text_filter);
                this.has_tasks          = this.filtered_tasks.length > 0;
                this.status_filter_cycle_button_index = this.status_filter_cycle_button_data.reduce((result, item, i) => item.value === this.status_filter ? i : result, 0);
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
