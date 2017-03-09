<template xmlns:v-on="http://www.w3.org/1999/xhtml">

    <table class="common-table">
        <thead v-if="headings || useDefaultHeadings">
            <tr>
                <th v-for="key in dataKeys">
                    <template v-if="headings && headings.hasOwnProperty(key)">{{ headings[ key ] }}</template>
                    <template v-else>
                        <template v-if="useDefaultHeadings">{{ key }}</template>
                    </template>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in data">
                <template v-for="key in dataKeys">

                    <!-- cell templates -->
                    <template v-if="cellConfigs && cellConfigs.hasOwnProperty(key)">

                        <!-- button -->
                        <template v-if="cellConfigs[key].type === 'button'">

                            <td class="cell-button"
                                :class="_getCellClass(row, key)">

                                <button v-on:click="_buttonClickHandler(row, key)"
                                        :disabled="_isDisabled(row, key)">

                                    <!-- icon -->
                                    <template v-if="cellConfigs[key].icon_class">

                                        <!-- indexed icon -->
                                        <template v-if="typeof cellConfigs[key].icon_class === 'object'">
                                            <i :class="_getIndexedIconClass(row, key)" aria-hidden="true"></i>
                                        </template>

                                        <!-- single icon -->
                                        <template v-else>
                                            <i :class="cellConfigs[key].icon_class" aria-hidden="true"></i>
                                        </template>

                                    </template>

                                    <!-- label -->
                                    <template v-if="cellConfigs[key].label">
                                        {{cellConfigs[key].label}}
                                    </template>

                                </button>

                            </td>

                        </template>

                        <!-- inline edit -->
                        <template v-if="cellConfigs[key].type === 'inline-edit'">

                            <td class="cell-inline-edit"
                                v-on:click="_inlineEditClickHandler(row, key)"
                                :class="_getCellClass(row, key)">

                                <!-- editing -->
                                <template v-if="editing_item_unique_id === row.unique_id">
                                    <input type="text"
                                           :id="row.unique_id"
                                           placeholder="task name"
                                           v-focus="editing_item_unique_id === row.unique_id"
                                           v-model="row[ key ]"
                                           v-on:keyup.enter="_inlineEditInputEnterHandler()"
                                           v-on-clickaway="_inlineEditInputClickOutsideHandler"
                                    />
                                </template>

                                <!-- not editing -->
                                <template v-else>
                                    {{ row[ key ] }}
                                </template>

                            </td>

                        </template>

                    </template>

                    <!-- default template -->
                    <template v-else>
                        <td class="cell-default" :class="['cell-' + key]">{{ row[ key ] }}</td>
                    </template>

                </template>
            </tr>
        </tbody>
    </table>

</template>

<script type="text/babel">
    import Vue from 'vue';
    import { focus } from 'vue-focus';
    import { mixin as clickaway } from 'vue-clickaway';

    // utils
    import * as CollectionUtils from 'utils/collection.utils';

    let _vm;

    export default {

        data: function () {
            return {
                editing_item: null,
                editing_item_unique_id: null,
                editing_column_key: null
            };
        },

        directives: {
            focus: focus
        },

        mixins: [
            clickaway
        ],

        props: {
            useDefaultHeadings: true,
            cellConfigs: { type: Object, default: null },
            headings: { type: Object, default: null },
            dataKeys: { type: Array, default: [] },
            data: { type: Array, default: [] }
        },

        methods: {

            // ------------------------------------
            // handlers
            // ------------------------------------

            _buttonClickHandler: function (data, column_key) {

                if (!this.cellConfigs[ column_key ].hasOwnProperty('clickHandler')) {
                    return;
                }

                this.cellConfigs[ column_key ].clickHandler(data);
            },

            _inlineEditClickHandler: function (data, column_key) {

                if (this.cellConfigs[ column_key ].hasOwnProperty('canEdit') && !this.cellConfigs[ column_key ].canEdit(data)) {
                    return;
                }

                _vm.editing_item = data;
                _vm.editing_item_unique_id = data.unique_id;
                _vm.editing_column_key = column_key;
            },

            _inlineEditInputEnterHandler: function () {

                if (_vm.editing_item === null) {
                    return;
                }

                if (this.cellConfigs[ _vm.editing_column_key ].hasOwnProperty('blurHandler')) {
                    this.cellConfigs[ _vm.editing_column_key ].blurHandler(_vm.editing_item);
                }

                // reset editing
                _vm.editing_item = null;
                _vm.editing_item_unique_id = null;
                _vm.editing_column_key = null;
            },

            _inlineEditInputClickOutsideHandler: function () {

                if (_vm.editing_item === null) {
                    return;
                }

                if (this.cellConfigs[ _vm.editing_column_key ].hasOwnProperty('blurHandler')) {
                    this.cellConfigs[ _vm.editing_column_key ].blurHandler(_vm.editing_item);
                }

                // reset editing
                _vm.editing_item = null;
                _vm.editing_item_unique_id = null;
                _vm.editing_column_key = null;
            },

            // ------------------------------------
            // utils
            // ------------------------------------

            _getCellClass: function (data, column_key) {
                let _conditional_class = this.cellConfigs[ column_key ].hasOwnProperty('conditionalClass') ? this.cellConfigs[ column_key ].conditionalClass(data, _vm.editing_item_unique_id) : {};
                let _key_class = `cell-${column_key}`;
                return Object.assign({}, _conditional_class, _key_class);
            },

            _getIndexedIconClass: function (data, column_key) {

                if (!this.cellConfigs[ column_key ].hasOwnProperty('iconClassIndex')) {
                    return;
                }

                let _index = this.cellConfigs[ column_key ].iconClassIndex(data);

                let _result = {};
                _result[ this.cellConfigs[ column_key ].icon_class[ _index ] ] = true;

                return _result;
            },

            _isDisabled: function (data, column_key) {

                if (!this.cellConfigs[ column_key ].hasOwnProperty('isDisabled')) {
                    return;
                }

                return this.cellConfigs[ column_key ].isDisabled(data);
            }
        },

        created: function () {
            _vm = this;
        }
    };
</script>

<style scoped lang='scss'>
    @import '../../../styles/view/common/common-table/common-table.scss';
</style>
