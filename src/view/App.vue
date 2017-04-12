<template>
    <div class="wrapper">

        <header class="header">

            <div class="title" :class="{disabled: message !== null}">
                <h1>Tasks</h1>
                <div class="sub">by Neil Russell</div>
            </div>

            <div class="controls" :class="{disabled: message !== null}">

                <div class="control">

                    <template v-if="is_user_authenticated">
                        <button class="authenticated"
                                :class="{ 'offline': is_offline }"
                                v-on:click="_onConnect()">
                            <span class="label">{{user.first_name}} {{user.last_name}}</span>
                            <i class="fa fa-user" aria-hidden="true"></i>
                        </button>
                    </template>

                    <template v-else>
                        <button v-on:click="_onToggleShowLogin()">
                            <span class="label">login</span>
                            <i class="fa fa-user" aria-hidden="true"></i>
                        </button>
                    </template>

                </div>

                <!--<div class="control">-->

                    <!--<button v-on:click="_onToggleArtificialDelay()">-->

                        <!--<template v-if="is_artificially_delayed">-->
                            <!--<i class="fa fa-check-square" aria-hidden="true"></i>-->
                        <!--</template>-->

                        <!--<template v-else>-->
                            <!--<i class="fa fa-square" aria-hidden="true"></i>-->
                        <!--</template>-->

                    <!--</button>-->
                    <!--artificial delay-->
                <!--</div>-->
                <!---->
                <!--<div class="control">-->

                    <!--<button v-on:click="_onToggleMinimalMessage()">-->

                        <!--<template v-if="is_message_minimal">-->
                            <!--<i class="fa fa-check-square" aria-hidden="true"></i>-->
                        <!--</template>-->

                        <!--<template v-else>-->
                            <!--<i class="fa fa-square" aria-hidden="true"></i>-->
                        <!--</template>-->

                    <!--</button>-->
                    <!--minimal message-->
                <!--</div>-->
            </div>

        </header>

        <common-message :message="message" :minimal="is_message_minimal"></common-message>

        <section class="main" :class="{disabled: is_disabled}">

            <div class="wrapper">
                <div class="overlay"></div>
                <tasks v-show="!show_login"></tasks>
                <login v-show="show_login" :on-submit="_onUserLogin"></login>
            </div>

            <footer class="footer">
                <div class="column column-left">
                    <span class="highlight">&nbsp;</span>
                </div>
                <div class="column column-right">
                    <span>&nbsp;</span>
                </div>
            </footer>

        </section>

    </div>
</template>

<script type="text/babel">

    // data
    import * as app_settings from 'data/app.settings';
    import * as message_settings from 'data/message.settings';
    import { MESSAGE_STYLE } from 'data/models/basic/message.model';

    // actions
    import * as message_actions from 'state/message/message.actions';
    import * as app_actions from 'state/app/app.actions';
    import * as user_actions from 'state/user/user.actions';
    import * as project_actions from 'state/projects/project.actions';

    // components
    import CommonMessage from 'view/common/common-message/CommonMessage.dumb';
    import Tasks from './tasks/Tasks.smart';
    import Login from './login/Login.dumb';

    // store
    import { store } from 'state/store';

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
                is_artificially_delayed: app_settings.ARTIFICIAL_DELAY_DEFAULT,
                is_disabled: false,
                is_message_minimal: app_settings.MINIMAL_MESSAGE_DEFAULT,
                is_offline: false,
                is_user_authenticated: false,
                message: null,
                previous_message: null,
                show_login: false,
                user: null
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
                store.dispatch(app_actions.toggleArtificialDelay());
            },

            _onToggleMinimalMessage: function () {
                store.dispatch(app_actions.toggleMinimalMessage());
            },

            // ------------------------------------
            // handlers: login
            // ------------------------------------

            _onToggleShowLogin: function () {
                store.dispatch(app_actions.toggleShowLogin());
            },

            _onConnect: function () {
                store.dispatch(app_actions.connect());
            },

            _onUserLogin: function (credentials) {

                // TODO: fix this, credentials are strings for some reason
                if ((credentials.username === null && credentials.email === null) || credentials.password === null) {
                    return store.dispatch(message_actions.setMessage({
                        label: "Please provide all required credentials",
                        style: MESSAGE_STYLE.WARNING,
                        expire: message_settings.MESSAGE_DEFAULT_EXPIRE * 2
                    }));
                }

                store.dispatch(user_actions.loginUser(this.user, credentials));
            },

            // ------------------------------------
            // handlers: login
            // ------------------------------------

            _onUserLogout: function () {
                store.dispatch(user_actions.logoutUser(this.user));
            },

            // ------------------------------------
            // utils
            // ------------------------------------

            _updateView: function () {
                const _state = store.getState();

                // user

                this.is_user_authenticated = _state.user !== null ? _state.user.is_authenticated : false;
                this.user = _state.user;

                // app

                this.is_artificially_delayed = _state.app.artificial_delay > 0;
                this.is_disabled = _state.app.is_disabled;
                this.is_offline = _state.app.is_offline;
                this.is_message_minimal = _state.app.is_message_minimal;
                this.show_login = _state.app.show_login;

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
        }
    };

</script>

<style lang="scss">
    @import '../styles/view/app.scss';
</style>
