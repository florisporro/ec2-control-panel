import Vue from 'vue'
import App from './App.vue'
import VueSocketio from 'vue-socket.io';

Vue.use(VueSocketio, window.location.origin);

window.EventBus = new Vue();

new Vue({
  el: '#app',
  render: (h) => h(App)
})
