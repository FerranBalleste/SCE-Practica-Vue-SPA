import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueResource from 'vue-resource';
Vue.use(VueResource);

import App from './App.vue'

const Empty = require('./assets/js/components/empty.vue');
const AllProducts = require('./assets/js/components/all-products.vue');

const routes = [
    {
        name: 'empty',
        path: '/',
        component: Empty,
        props: true
    },
    {
        name: 'all_products',
        path: '/products/:city',
        component: AllProducts,
        props: true
    }
];
var router = new VueRouter({ routes: routes, mode: 'history' });
new Vue(Vue.util.extend({ router }, App)).$mount('#app');
