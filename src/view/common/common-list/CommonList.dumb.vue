<template xmlns:v-on="http://www.w3.org/1999/xhtml">

    <ul class="common-list">
        <template v-for="item in data">

            <template v-if="selected_item_unique_id === item.unique_id">
                <li class="selected">
                    <span>{{ item[ labelField ] }}</span>
                    <i class="fa fa-angle-double-right fa-2x" aria-hidden="true"></i>
                </li>
            </template>

            <template v-else>
                <li><button v-on:click="_onSelectProject(item)">{{ item[ labelField ] }}</button></li>
            </template>

        </template>
    </ul>

</template>

<script>
    let _vm;

    export default {

        data: function () {
            return {
                selected_item_unique_id: null
            };
        },

        props: {
            labelField: {
                type: String
            },
            data: {
                type: Array,
                default: []
            },
            onSelect: {
                type: Function
            }
        },

        methods: {
            _onSelectProject: function (item) {
                if (typeof this.onSelect === 'undefined') {
                    return;
                }

                _vm.selected_item_unique_id = item.unique_id;

                this.onSelect(item);
            },

            _getItemClass: function (item) {
                if (_vm.editing_item_unique_id === null) {
                    return;
                }

                return {
                    selected: item.unique_id === _vm.selected_item_unique_id
                };
            }
        },

        created: function () {
            _vm = this;
        }
    };

</script>

<style scoped lang='scss'>
    @import '../../../styles/view/common/common-list/common-list.scss';
</style>
