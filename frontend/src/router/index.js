import Vue from 'vue'
import Router from 'vue-router'
import Catalog from '../components/Catalog/Catalog.vue'
import Basket from '../components/Basket/Basket.vue'
import Orders from '../components/Orders/Orders.vue'
import Payments from '../components/Payments/Payments.vue'
import Stock from '../components/Stock/Stock.vue'

Vue.use(Router);

export const router =  new Router({
    mode: 'history',
    routes: [
        {path: '/', component: Catalog},
        {path: '/basket', component: Basket},
        {path: '/orders', component: Orders},
        {path: '/payments', component: Payments},
        {path: '/stock', component: Stock}
    ]
})