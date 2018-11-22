import Vue from 'vue'
import App from './App.vue'
import VueSocketio from 'vue-socket.io';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(VueSocketio, window.location.origin);

library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)

window.EventBus = new Vue();

new Vue({
  el: '#app',
  components: { App },
  render: (h) => h(App)
})
