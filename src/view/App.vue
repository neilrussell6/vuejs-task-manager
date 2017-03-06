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
    import { Store } from 'state/store';
//    import { setEndpointHost, setEndpointPath, setHeaders } from 'redux-json-api';

    export default {

        ready: function () {
//            Store.store.dispatch(setEndpointHost('http://pj.nr6.laravel5-task-manager-api/'));
//            Store.store.dispatch(setEndpointPath('api'));
//            Store.store.dispatch(setHeaders({
//                // Authorization: `Bearer myToken123`,
//                'Content-Type': 'application/vnd.api+json',
//                Accept: 'application/vnd.api+json'
//            }));
        }
    };

</script>

<style lang="scss">
    @import '../styles/view/app.scss';
</style>
