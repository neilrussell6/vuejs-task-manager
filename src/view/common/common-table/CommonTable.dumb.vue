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
            <tr v-for="row in data" :class="[{ editing: row.uuid === editing_item_uuid}, _rowClass(row)]">
                <template v-for="key in dataKeys">

                    <!-- cell templates -->
                    <template v-if="cellConfigs && cellConfigs.hasOwnProperty(key)">

                        <!-- button -->
                        <template v-if="cellConfigs[key].type === 'button'">

                            <td class="cell-button" :class="'cell-'+key">

                                <button v-on:click="_onButtonClick(row, key)"
                                        :class="{'disabled': _isDisabled(row, key)}">

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

                            <td class="inline-edit"
                                v-on:click="_onInlineEditClick(row, key)"
                                :class="'cell-'+key">

                                <!-- editing -->
                                <template v-if="editing_item_uuid === row.uuid">
                                    <input type="text"
                                           :id="row.uuid"
                                           placeholder="task name"
                                           v-focus="editing_item_uuid === row.uuid"
                                           v-model="row[ key ]"
                                           v-on:keyup.enter="_onInlineEditEnter()"
                                           v-on-clickaway="_onInlineEditClickOutside"
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
    import { focus } from 'vue-focus';
    import { mixin as clickaway } from 'vue-clickaway';

    // utils
    import * as CollectionUtils from 'utils/collection.utils';
    import * as StorageUtils from 'utils/storage/storage.utils';

    let _vm;

    export default {

        data: function () {
            return {
                editing_item: null,
                editing_item_before_value: null,
                editing_item_uuid: null,
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
            cellConfigs: { type: Object, default: null },
            config: { type: Object, default: {} },
            data: { type: Array, default: [] },
            dataKeys: { type: Array, default: [] },
            defaultEditingColumnKey: { type: String, default: 'name' },
            focusNewItem: { type: Boolean, default: true },
            headings: { type: Object, default: null },
            useDefaultHeadings: { type: Boolean, default: true }
        },

        watch: {
            data: function (value, prev_value) {

                // if empty or no new items
                // ... then exit
                if (value.length === 0 || value.length === prev_value.length) {
                    return;
                }

                // there are new items
                // ... focus last new item
                if (this.focusNewItem) {

                    const _new_item_index = value.length - 1;
                    const _new_item = value[ _new_item_index ];

                    // item is invalid
                    if (!_new_item.hasOwnProperty(this.defaultEditingColumnKey)) {
                        return;
                    }

                    // if item is new
                    // ... focus for editing
                    if (_new_item.is_new) {

                        this.editing_item = _new_item;
                        this.editing_item_before_value = _new_item[ this.defaultEditingColumnKey ];
                        this.editing_item_uuid = _new_item.uuid;
                        this.editing_column_key = this.defaultEditingColumnKey;

                        if (this.cellConfigs[ this.editing_column_key ].hasOwnProperty('onEdit')) {
                            this.cellConfigs[ this.editing_column_key ].onEdit(this.editing_item);
                        }
                    }
                }
            }
        },

        methods: {

            // ------------------------------------
            // handlers
            // ------------------------------------

            _onButtonClick: function (data, column_key) {

                if (!_vm.cellConfigs[ column_key ].hasOwnProperty('onClick')) {
                    return;
                }

                _vm.cellConfigs[ column_key ].onClick(data);
            },

            _onInlineEditClick: function (data, column_key) {

                // if already editing
                if (this.editing_item !==  null) {
                    return;
                }

                if (this.cellConfigs[ column_key ].hasOwnProperty('canEdit') && !this.cellConfigs[ column_key ].canEdit(data)) {
                    return;
                }

                this.editing_item = data;
                this.editing_item_before_value = data[ column_key ];
                this.editing_item_uuid = data.uuid;
                this.editing_column_key = column_key;

                if (this.cellConfigs[ this.editing_column_key ].hasOwnProperty('onEdit')) {
                    this.cellConfigs[ this.editing_column_key ].onEdit(this.editing_item);
                }
            },

            _onInlineEditEnter: function () {

                if (this.editing_item === null) {
                    return;
                }

                if (this.cellConfigs[ this.editing_column_key ].hasOwnProperty('onBlur')) {
                    this.cellConfigs[ this.editing_column_key ].onBlur(this.editing_item, this.editing_column_key, this.editing_item[ this.editing_column_key ], this.editing_item_before_value);
                }

                this._resetEditing();
            },

            _onInlineEditClickOutside: function () {

                if (this.editing_item === null) {
                    return;
                }

                if (this.cellConfigs[ this.editing_column_key ].hasOwnProperty('onBlur')) {
                    this.cellConfigs[ this.editing_column_key ].onBlur(this.editing_item, this.editing_column_key, this.editing_item[ this.editing_column_key ], this.editing_item_before_value);
                }

                this._resetEditing();
            },

            // ------------------------------------
            // utils
            // ------------------------------------

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
            },

            _resetEditing: function () {
                _vm.editing_item = null;
                _vm.editing_item_uuid = null;
                _vm.editing_column_key = null;
            },

            _rowClass: function (row) {
                const _classes = this.config.row_class_properties.reduce((result, property) => {
                    return row.hasOwnProperty(property) ? [ ...result, ...[ `${property}-${row[ property ]}` ]] : result;
                }, []);

                return _classes.join(" ");
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
