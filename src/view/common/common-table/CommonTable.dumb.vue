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
                                v-bind:class="_getCellClass(row, cellConfigs[key], key, editing_item_unique_id)">

                                <button v-on:click="_buttonClickHandler(row, cellConfigs[key])"
                                        :disabled="_isDisabled(row, cellConfigs[key])">

                                    <!-- icon -->
                                    <template v-if="cellConfigs[key].icon_class">

                                        <!-- indexed icon -->
                                        <template v-if="typeof cellConfigs[key].icon_class === 'object'">
                                            <i v-bind:class="_getIndexedIconClass(row, cellConfigs[key])" aria-hidden="true"></i>
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
                                v-on:click="_inlineEditClickHandler(row, cellConfigs[key])"
                                v-bind:class="_getCellClass(row, cellConfigs[key], key, editing_item_unique_id)">

                                <!-- editing -->
                                <template v-if="editing_item_unique_id === row.unique_id">
                                    <input type="text"
                                           :id="row.unique_id"
                                           placeholder="task name"
                                           v-focus="editing_item_unique_id === row.unique_id"
                                           v-model="row[ key ]"
                                           v-on:keyup.enter="_inlineEditInputEnterHandler(row.unique_id, cellConfigs[key])"
                                           v-click-outside="_inlineEditInputClickOutsideHandler(row.unique_id, cellConfigs[key])"
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

<script>
    import Vue from 'vue';
    import { focus } from 'vue-focus';
    import { clickOutside } from 'view/common/click-outside/click-outside.directive';

    let _vm;

    export default {

        data: function () {
            return {
                editing_item_unique_id: null
            };
        },

        directives: {
            focus: focus,
            clickOutside: clickOutside
        },

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

            _buttonClickHandler: function (data, config) {
                if (!config.hasOwnProperty('clickHandler')) {
                    return;
                }

                config.clickHandler(data);
            },

            _inlineEditClickHandler: function (data, config) {
                if (config.hasOwnProperty('canEdit') && !config.canEdit(data)) {
                    return;
                }

                _vm.editing_item_unique_id = data.unique_id;
            },

            _inlineEditInputEnterHandler: function (unique_id, config) {

                let _data = this._getItemByUniqueId(unique_id);

                _vm.editing_item_unique_id = null;

                if (config.hasOwnProperty('blurHandler')) {
                    config.blurHandler(_data);
                }
            },

            _inlineEditInputClickOutsideHandler: function (unique_id, config) {

                if (_vm.editing_item_unique_id === null) {
                    return;
                }

                let _data = this._getItemByUniqueId(unique_id);

                _vm.editing_item_unique_id = null;

                if (config.hasOwnProperty('blurHandler')) {
                    config.blurHandler(_data);
                }
            },

            // ------------------------------------
            // utils
            // ------------------------------------

            _getCellClass: function (data, config, key, editing_item_unique_id) {
                let _conditional_class = config.hasOwnProperty('conditionalClass') ? config.conditionalClass(data, editing_item_unique_id) : {};
                let _key_class = `cell-${key}`;
                return Object.assign({}, _conditional_class, _key_class);
            },

            _getIndexedIconClass: function (data, config) {
                if (!config.hasOwnProperty('iconClassIndex')) {
                    return;
                }

                let _index = config.iconClassIndex(data);

                let _result = {};
                _result[ config.icon_class[ _index ] ] = true;

                return _result;
            },

            _getItemByUniqueId: function (unique_id) {
                return _vm.data.reduce(function (result, item) {
                    if (unique_id === item.unique_id) {
                        result = item;
                    }

                    return result;
                }, null);
            },

            _isDisabled: function (data, config) {
                if (!config.hasOwnProperty('isDisabled')) {
                    return;
                }

                return config.isDisabled(data);
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
