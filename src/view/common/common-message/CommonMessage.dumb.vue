<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="common-message" :class="_getClass(message)">

        <!--<div class="content" :class="{minimal: is_minimal}">-->
        <div class="content">
            <template v-if="message">

                <div class="icon icon-before-label" v-if="message.icon && message.buttons">
                    <i :class="_getIconClass(message.icon)"></i>
                </div>

                <div class="label">{{message.label}}</div>

                <div class="icon icon-after-label" v-if="message.icon && !message.buttons">
                    <i :class="_getIconClass(message.icon)"></i>
                </div>

                <template v-if="message.buttons" v-for="button in message.buttons">
                    <div class="button">
                        <button v-on:click="_buttonClickHandler(message, button)">{{button.label}}</button>
                    </div>
                </template>

            </template>

        </div>
    </div>
</template>

<script type="text/babel">
    import { MESSAGE_STYLE } from 'data/models/basic/message.model';

    export default {

        data: function () {
            return {
                has_message: false
            };
        },

        computed: {
//            is_minimal: function (value) {
//                if (this.message === null) {
//                    return false;
//                }
//                return (this.minimal && this.message.style !== 'message-type-warning' && this.message.style !== 'message-type-danger');
//            }
        },

        props: {
            message: {
                type: Object,
                default: null
            },
            minimal: {
                type: Boolean,
                default: true
            }
        },

        methods: {

            // ------------------------------------
            // handlers
            // ------------------------------------

            _buttonClickHandler: function (message, button) {
                if (!message.hasOwnProperty('clickHandler')) {
                    return;
                }

                message.clickHandler(button, message.action);
            },

            // ------------------------------------
            // utils
            // ------------------------------------

            _getClass: function (config) {
                if (config === null) {
                    return {};
                }

                return {
                    'has-message': true,
                    'info': config.style === MESSAGE_STYLE.INFO,
                    'success': config.style === MESSAGE_STYLE.SUCCESS,
                    'warning': config.style === MESSAGE_STYLE.WARNING,
                    'danger': config.style === MESSAGE_STYLE.DANGER
                };
            },

            _getIconClass: function (config) {
                if (!config.hasOwnProperty('class')) {
                    return {};
                }

                return config.class.split(' ').reduce(function (result, item) {
                    result[ item ] = true;
                    return result;
                }, {});
            }
        }
    };
</script>

<style scoped lang='scss'>
    @import '../../../styles/view/common/common-message/common-message.scss';
</style>
