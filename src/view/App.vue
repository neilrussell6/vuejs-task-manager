<template>
    <div class="wrapper">

        <header class="header">

            <div class="title" :class="{disabled: message !== null}">
                <h1>VueJS/Laravel Task Manager</h1>
                <div class="sub">by Neil Russell</div>
            </div>

            <div class="controls" :class="{disabled: message !== null}">
                <div class="control">

                    <button v-on:click="_onToggleArtificialDelay()">

                        <template v-if="is_artificially_delayed">
                            <i class="fa fa-check-square" aria-hidden="true"></i>
                        </template>

                        <template v-else>
                            <i class="fa fa-square" aria-hidden="true"></i>
                        </template>

                    </button>
                    artificial delay
                </div>
                <div class="control">

                    <button v-on:click="_onToggleMinimalMessage()">

                        <template v-if="is_message_minimal">
                            <i class="fa fa-check-square" aria-hidden="true"></i>
                        </template>

                        <template v-else>
                            <i class="fa fa-square" aria-hidden="true"></i>
                        </template>

                    </button>
                    minimal message
                </div>
            </div>

        </header>

        <common-message :message="message" :minimal="is_message_minimal"></common-message>

        <section class="main" :class="{disabled: is_disabled}">

            <div class="wrapper">
                <div class="overlay"></div>
                <tasks v-if="user_is_authenticated"></tasks>
                <login v-else :on-submit="_onUserLogin"></login>
            </div>

            <footer class="footer">
                <div class="column column-left">
                    contact: <span class="highlight">neilrussell6@gmail.com</span>
                </div>
                <div class="column column-right">
                    <button class="no-bg" v-on:click="_onUserLogout()">
                        <span>logout</span><i class="fa fa-sign-out" aria-hidden="true"></i>
                    </button>
                </div>
            </footer>

        </section>

    </div>
</template>

<script type="text/babel">

    // data
    import * as app_settings from 'data/app.settings';

    // actions
    import * as MessageActions from 'state/message/message.actions';
    import * as AppActions from 'state/app/app.actions';
    import * as UserActions from 'state/user/user.actions';

    // components
    import CommonMessage from 'view/common/common-message/CommonMessage.dumb';
    import Tasks from './tasks/Tasks.smart';
    import Login from './login/Login.dumb';

    // store
    import { store } from 'state/store';
    import { setEndpointHost, setEndpointPath, setAccessToken, setHeaders } from 'redux-json-api';

    // settings
    import { ACTION_REQUEST_DELETE_CONFIRMATION } from 'state/message/message.constants';

    // utils
    import * as MessageUtils from 'utils/message/message.utils';

    let _vm;

    export default {

        components: {
            CommonMessage,
            Tasks,
            Login
        },

        data: function () {
            return {
                message: null,
                previous_message: null,
                is_message_minimal: app_settings.MINIMAL_MESSAGE_DEFAULT,
                is_disabled: false,
                is_artificially_delayed: app_settings.ARTIFICIAL_DELAY_DEFAULT,
                user_is_authenticated: false
            };
        },

        methods: {

            // ------------------------------------
            // handlers: message
            // ------------------------------------

            _onMessageButtonClick: function (button, action) {

                if (!action.hasOwnProperty('callback')) {
                    return;
                }

                action.callback(button.value);
            },

            _onToggleArtificialDelay: function () {
                store.dispatch(AppActions.toggleArtificialDelay());
            },

            _onToggleMinimalMessage: function () {
                store.dispatch(AppActions.toggleMinimalMessage());
            },

            // ------------------------------------
            // handlers: login
            // ------------------------------------

            _onUserLogin: function (credentials) {
                store.dispatch(UserActions.loginUser(credentials));
            },

            // ------------------------------------
            // handlers: login
            // ------------------------------------

            _onUserLogout: function () {
                store.dispatch(UserActions.logoutUser());
            },

            // ----------------------
            // utils
            // ----------------------

            _updateView: function () {
                const _state = store.getState();

                // user

                this.user_is_authenticated = _state.user.is_authenticated;

                // app

                this.is_disabled = _state.app.is_disabled;
                this.is_artificially_delayed = _state.app.artificial_delay > 0;
                this.is_message_minimal = _state.app.is_message_minimal;

                // message

                // if unset message
                if (_state.message === null) {
                    this.message            = null;
                    this.previous_message   = null;
                }
                // if new message
                else if (_state.message !== this.previous_message && _state.message !== null) {

                    _state.message.label = MessageUtils.populateMessageLabelVars(_state.message.label, _state, 'name');

                    this.message            = _state.message;
                    this.previous_message   = _state.message;

                    if (this.message.expire) {
                        window.setTimeout(function () {
                            _vm.message = null;
                        }, this.message.expire);
                    }

                    if (this.message.hasOwnProperty('buttons')) {
                        this.message.onClick = this._onMessageButtonClick.bind(this);
                    }
                }
            }
        },

        created: function () {
            _vm = this;
            store.subscribe(this._updateView.bind(this));

            store.dispatch(setEndpointHost(app_settings.DOMAIN));
            store.dispatch(setEndpointPath(app_settings.API_PREFIX));
            store.dispatch(setHeaders({
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json'
            }));
        }
    };

</script>

<style lang="scss">
    @import '../styles/view/app.scss';
</style>
