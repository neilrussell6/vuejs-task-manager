<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="common-message"
         v-bind:class="_getClass(message)">

        <template v-if="message">

            <div class="icon icon-before-label" v-if="message.icon && message.buttons">
                <i v-bind:class="_getIconClass(message.icon)"></i>
            </div>

            <div class="label">{{message.label}}</div>

            <div class="icon icon-after-label" v-if="message.icon && !message.buttons">
                <i v-bind:class="_getIconClass(message.icon)"></i>
            </div>

            <template v-if="message.buttons" v-for="button in message.buttons">
                <div class="button">
                    <button v-on:click="_buttonClickHandler(message, button)">{{button.label}}</button>
                </div>
            </template>

        </template>

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

        props: {
            message: {
                type: Object,
                default: null
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
