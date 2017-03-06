import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

import Dashboard from './dashboard/Dashboard.smart';
import Tasks from './tasks/Tasks.smart';

const routes = [
    { path: '/dashboard', component: Dashboard },
    { path: '/tasks', component: Tasks }
];

Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({ routes });

new Vue({
    router,
    el: '#app',
    components: { App }
});
