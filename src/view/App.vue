<template>
    <div class="app wrapper">

        <header>
            <nav>
                <router-link to="/dashboard">Dashboard</router-link>
                <router-link to="/tasks">Tasks</router-link>
            </nav>
        </header>

        <br/>

        <router-view></router-view>

    </div>
</template>

<script type="text/babel">

    // store
    import { store } from 'state/store';
    import { setEndpointHost, setEndpointPath, setAccessToken, setHeaders } from 'redux-json-api';

    export default {

        created: function () {
            store.dispatch(setEndpointHost('http://127.0.0.1:8000'));
            store.dispatch(setEndpointPath('/api'));
            store.dispatch(setHeaders({
                'Authorization': 'Bearer TOKEN',
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json'
            }));
        }
    };

</script>

<style lang="scss">
    @import '../styles/view/app.scss';
</style>
