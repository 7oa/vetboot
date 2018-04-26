import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import {router} from './router'
import axios from 'axios'


Vue.use(BootstrapVue);
Vue.prototype.$http = axios;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
