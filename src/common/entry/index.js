// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import 'es6-promise/auto'; // must before vue-router
import Vue from 'vue';
import App from '@/App';
import router from '@/router';
import vuescroll from 'vuescroll/dist/vuescroll';
import 'vuescroll/dist/vuescroll.css';
import hui from 'h_ui';
import 'h_ui/dist/h_ui.min.css';
import http from '@/http';
import store from '@/store';
import * as filters from '@/filters';
// import { pathName } from '@/filters';
import VueCookie from 'vue-cookie';
import api from '@/constant/api';
import md5 from 'js-md5';
// import searchForm from '@/components/search-form.vue'
import directives from '@/directives';

Vue.use(directives);
Vue.use(VueCookie);
require('@/assets/css/common.css');
// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.prototype.$http = http;
Vue.prototype.$api = api;
Vue.prototype.$md5 = md5;
Vue.prototype.$pathName = filters.pathName;
// Vue.component('search-form', searchForm);

Vue.config.productionTip = false;
Vue.use(vuescroll);
Vue.prototype.$vuescrollConfig = {
    rail: {
        size: '5px'
    },
    bar: {
        background: '#a2a2a2',
        width: '5px'
    }
};
Vue.use(hui);
// require('@/components/table.js')
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
