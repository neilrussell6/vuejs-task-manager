<template>
    <div class="wrapper">

        <header class="header">
            <common-message :message="message"></common-message>
        </header>

        <section class="main" :class="{disabled: is_disabled}">
            <tasks></tasks>
        </section>

    </div>
</template>

<script type="text/babel">

    // actions
    import * as MessageActions from 'state/message/message.actions';
    import * as ProjectsActions from 'state/projects/project.actions';

    // components
    import CommonMessage from 'view/common/common-message/CommonMessage.dumb';
    import Tasks from './tasks/Tasks.smart';

    // store
    import { store } from 'state/store';
    import { setEndpointHost, setEndpointPath, setAccessToken, setHeaders } from 'redux-json-api';

    // settings
    import { ACTION_REQUEST_DELETE_CONFIRMATION } from 'state/message/message.settings';

    // utils
    import * as MessageUtils from 'state/message/message.utils';

    let _vm;

    export default {

        components: {
            CommonMessage,
            Tasks
        },

        data: function () {
            return {
                message: null,
                previous_message: null,
                is_disabled: false
            };
        },

        methods: {

            // ------------------------------------
            // handlers: message
            // ------------------------------------

            _messageButtonClickHandler: function (button, action) {

                if (!action.hasOwnProperty('callback')) {
                    return;
                }

                action.callback(button.value);
            },

            // ----------------------
            // utils
            // ----------------------

            _updateView: function () {
                const _state            = store.getState();

                // app disabled

                this.is_disabled = _state.app.is_disabled;

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
                        this.message.clickHandler = this._messageButtonClickHandler.bind(this);
                    }
                }
            }
        },

        created: function () {
            _vm = this;
            store.subscribe(this._updateView.bind(this));
            store.dispatch(setEndpointHost('http://127.0.0.1:8000'));
            store.dispatch(setEndpointPath('/api'));
            store.dispatch(setHeaders({
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImlzcyI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9cL2FwaVwvYWNjZXNzX3Rva2VucyIsImlhdCI6MTQ4ODc5MDM3OCwiZXhwIjoxODQ4NzkwMzc4LCJuYmYiOjE0ODg3OTAzNzgsImp0aSI6IjI0NTVjYTY4MWViOWQwNWQ3MzU5MTgzMzBjZGU0NjEyIn0.KhIHnlieyeiPuio_10rLK978cHg0flFR32IRNOSlNJg',
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json'
            }));
            store.dispatch(ProjectsActions.refreshProjects());
        }
    };

</script>

<style lang="scss">
    @import '../styles/view/app.scss';
</style>
