<template>
    <div class="body bordered">

        <div class="content">
            <form v-on:submit.prevent>

                <fieldset>
                    <input type="text" v-model="identifier" placeholder="username or email..." />
                    <input type="password" v-model="password" placeholder="password..." />
                    <button v-on:click="_onSubmitClick()">LOGIN</button>
                </fieldset>

                <legend>Try it out, login with:</legend>
                <legend>identifier: <span class="highlight">demo</span></legend>
                <legend>password: <span class="highlight">demo</span></legend>
            </form>
        </div>

    </div>
</template>

<script type="text/babel">
    // dumb component (this means it does not interact with application state, it only emit events and fires callbacks so parent components can interact with state)

    export default {
        data: function () {
            return {
                identifier: "demo",
                password: "demo"
            };
        },

        props: {
            onSubmit: { type: Function }
        },

        methods: {

            // ------------------------------------
            // handlers
            // ------------------------------------

            _onSubmitClick: function () {
                this._submit();
            },

            _onPasswordEnter: function () {
                this._submit();
            },

            // ------------------------------------
            // utils
            // ------------------------------------

            _submit: function () {

                if (this.identifier === null || this.password === null) {
                    return;
                }

                let _credentials =  { password: this.password };

                if (this.identifier.match('/\@/')) {
                    _credentials.email = this.identifier;
                } else {
                    _credentials.username = this.identifier;
                }

                if (typeof this.onSubmit !== 'undefined') {
                    this.onSubmit(_credentials);
                }
            }
        }
    };
</script>

<style scoped lang='scss'>
    @import '../../styles/view/login/login.scss';
</style>
