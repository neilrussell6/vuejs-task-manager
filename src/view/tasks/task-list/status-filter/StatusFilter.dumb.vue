<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <ul class="status-filter-list">
        <li class="status-filter-list-item"
            v-for="filter in filters">
            <template v-if="selectedStatusFilter === filter.type"><span>{{ filter.label }}</span></template>
            <template v-else><button v-on:click="_onSelection(filter)">{{ filter.label }}</button></template>
        </li>
    </ul>
</template>

<script>
    // dumb component (this means it does not interact with application state, it only emit events and fires callbacks so parent components can interact with state)

    import Vue from 'vue';

    // models
    import { STATUS_FILTER_TYPE, StatusFilter } from 'data/models/basic/status-filter.model';

    // utils
    import * as Utils from 'utils/status-filter/status-filter.utils';

    Vue.filter('complete', function (value, input) {
        return Utils.filterTasks(value, input);
    });

    export default {
        data: function () {
            return {
                filters: [
                    new StatusFilter({ label: 'All',            type: STATUS_FILTER_TYPE.ALL }),
                    new StatusFilter({ label: 'Incomplete',     type: STATUS_FILTER_TYPE.INCOMPLETE }),
                    new StatusFilter({ label: 'Complete',       type: STATUS_FILTER_TYPE.COMPLETE }),
                    new StatusFilter({ label: 'Trash',          type: STATUS_FILTER_TYPE.TRASH })
                ]
            };
        },

        props: {
            selectedStatusFilter: {
                type: String
            },

            onSelect: {
                type: Function
            }
        },

        methods: {
            _onSelection: function (filter) {
                if (typeof this.onSelect === 'undefined') {
                    return;
                }
                this.onSelect(filter.type);
            }
        }
    };
</script>

<style scoped lang='scss'>
    @import '../../../../styles/view/tasks/status-filter/status-filter.scss';
</style>
