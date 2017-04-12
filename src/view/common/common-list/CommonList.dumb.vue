<template xmlns:v-on="http://www.w3.org/1999/xhtml">

    <ul class="common-list">
        <template v-for="item in data">

            <!-- selected / inline edit -->
            <template v-if="selected_item_uuid === item.uuid">

                <li class="selected inline-edit editable"
                    :class="{editing: editing_item_uuid === item.uuid}"
                    v-on:click="_onInlineEditClick(item)">

                    <!-- editing -->
                    <template v-if="editing_item_uuid === item.uuid">
                        <input type="text"
                               :id="item.uuid"
                               placeholder="project name"
                               v-focus="editing_item_uuid === item.uuid"
                               v-model="item[ labelField ]"
                               v-on:keyup.enter="_onInlineEditEnter()"
                               v-on-clickaway="_onInlineEditClickOutside"
                        />
                        <i class="fa fa-angle-double-right fa-2x" aria-hidden="true"></i>
                    </template>

                    <!-- not editing -->
                    <template v-else>
                        <span>{{ item[ labelField ] }}</span>
                        <i class="fa fa-angle-double-right fa-2x" aria-hidden="true"></i>
                    </template>

                </li>
            </template>

            <!-- not selected -->
            <template v-else>
                <li>
                    <button v-on:click="_onSelectProject(item)">{{ item[ labelField ] }}</button>
                </li>
            </template>

        </template>
    </ul>

</template>

<script type="text/babel">
    import { focus } from 'vue-focus';
    import { mixin as clickaway } from 'vue-clickaway';

    // utils
    import * as CollectionUtils from 'utils/collection.utils';
    import * as StorageUtils from 'utils/storage/storage.utils';

    export default {

        data: function () {
            return {
                editing_item: null,
                editing_item_before_value: null,
                editing_item_uuid: null,
                selected_item_uuid: null
            };
        },

        directives: {
            focus: focus
        },

        mixins: [
            clickaway
        ],

        props: {
            data: { type: Array, default: [] },
            focusNewItem: { type: Boolean, default: true },
            labelField: { type: String },
            onBlur: { type: Function },
            onEdit: { type: Function },
            onSelect: { type: Function },
            selectedUuid: { type: String, default: null }
        },

        watch: {
            data: function (value, prev_value) {

                // if empty or no new items
                // ... then exit
                if (value.length === 0 || value.length === prev_value.length) {
                    return;
                }

                // there are new items
                // ... focus new item
                if (this.focusNewItem) {

                    const _new_item_index = value.length - 1;
                    const _new_item = value[ _new_item_index ];

                    // item in invalid
                    if (!_new_item.hasOwnProperty(this.labelField)) {
                        return;
                    }

                    // if item is new
                    // ... focus for editing
                    if (_new_item.is_new) {

                        this.editing_item = _new_item;
                        this.editing_item_before_value = _new_item[ this.labelField ];
                        this.editing_item_uuid = _new_item.uuid;
                        this.selected_item_uuid = _new_item.uuid;

                        if (typeof this.onEdit !== 'undefined') {
                            this.onEdit(this.editing_item);
                        }
                    }
                }
            },
            selectedUuid: function (value) {
                this.selected_item_uuid = value;
            }
        },

        methods: {

            // ------------------------------------
            // handlers
            // ------------------------------------

            _onInlineEditClick: function (data) {

                // if already editing
                if (this.editing_item !==  null) {
                    return;
                }

                this.editing_item = data;
                this.editing_item_before_value = data[ this.labelField ];
                this.editing_item_uuid = data.uuid;

                if (typeof this.onEdit !== 'undefined') {
                    this.onEdit(this.editing_item);
                }
            },

            _onInlineEditEnter: function () {

                if (this.editing_item === null) {
                    return;
                }

                const _editing_item = this.editing_item;
                const _label_field = this.labelField;
                const _editing_item_value = this.editing_item[ this.labelField ];
                const _editing_item_before_value = this.editing_item_before_value;

                this._resetEditing();

                if (typeof this.onBlur !== 'undefined') {
                    this.onBlur(_editing_item, _label_field, _editing_item_value, _editing_item_before_value);
                }
            },

            _onInlineEditClickOutside: function () {

                if (this.editing_item === null) {
                    return;
                }

                const _editing_item = this.editing_item;
                const _label_field = this.labelField;
                const _editing_item_value = this.editing_item[ this.labelField ];
                const _editing_item_before_value = this.editing_item_before_value;

                this._resetEditing();

                if (typeof this.onBlur !== 'undefined') {
                    this.onBlur(_editing_item, _label_field, _editing_item_value, _editing_item_before_value);
                }
            },

            _onSelectProject: function (item) {

                if (typeof this.onSelect !== 'undefined') {
                    this.onSelect(item);
                }

                this.selected_item_uuid = item.uuid;
            },

            // ------------------------------------
            // utils
            // ------------------------------------

            _getItemClass: function (item) {

                if (this.editing_item_uuid === null) {
                    return;
                }

                return {
                    selected: item.uuid === this.selected_item_uuid
                };
            },

            _resetEditing: function () {
                this.editing_item = null;
                this.editing_item_before_value = null;
                this.editing_item_uuid = null;
            }
        }
    };

</script>

<style scoped lang='scss'>
    @import '../../../styles/view/common/common-list/common-list.scss';
</style>
