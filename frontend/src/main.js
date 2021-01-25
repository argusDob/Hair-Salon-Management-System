
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import NavSideBar from '@/components/Navigation/NavSideBar.vue';
import NavTopBar from '@/components/Navigation/NavTopBar.vue';

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Vue.component('navSideBar', NavSideBar);
Vue.component('navTopBar', NavTopBar);




// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(Vuelidate)
Vue.use(require('vue-moment'));





Vue.config.productionTip = false

new Vue({
  router,
  store,
  components: {
    'navSideBar': NavSideBar
  },
  render: h => h(App)
}).$mount('#app')