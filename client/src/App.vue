<template lang="pug">
  #app
    .container#title
      h1 NodeJS + Express + Vue.js + Webpack + LowDB + Docker boilerplate
    .container#toolset
      .row
        .col-md-8
          h3 Hello world
        .col-md-4
          button(@click="count").btn.btn-outline-primary Count {{counter}}
          Log(:logdata="logdata")
</template>

<script>
// Components
import Log from './components/Log.vue';
import moment from 'moment';

// Setup stuff
const ls = window.localStorage;

export default {
  name: 'app',
  components: {
    Log,
    ProcessQueue
  },
  data() {
    return {
      isConnected: false,
      counter: 0,
      logdata: [],
    }
  },
  created: function() {
    EventBus.$on('error', error => {
      // Error emits the message as a log and pauses the queue
      EventBus.$emit('log', "ERROR: " + error);
    });

    EventBus.$on('log', (message, type) => {
      var new_log = {
        timestamp: moment(),
        message: message,
        type: type || 'none'
      };
      this.logdata.push(new_log);
      this.$socket.emit('client_log', new_log);
    });
  },
  methods: {
    count() {
      this.counter++;
      EventBus.$emit('log', "Counter: " + this.counter);
      this.$socket.emit('setCounter', this.counter);
    }
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
      EventBus.$emit("log", "Client connected to server", "info");
      this.$socket.emit('sendstate');
    },

    reconnect() {
      this.isConnected = true;
      EventBus.$emit("log", "Client reconnected", "info");
    },

    connect_error() {
      EventBus.$emit("log", "Lost connection to server", "warning");
      this.isConnected = false;
    },

    disconnect() {
      this.isConnected = false;
    },

    state(state) {
      this.counter = state.counter;
      this.logdata = state.log;
    },

    server_log(new_log) {
      this.logdata.push(new_log);
    }
  }
}
</script>

<style lang="scss">  
  @import './assets/main.scss';

  .container#toolset {
    border-left: 10px solid rgb(240,128,128);
    background: white;
    padding: 2em;
  }

  .container#title {
    margin-top: 2em;
    h1 {
      color: white;
      font-weight: 800;
      font-family: 'Fira Sans', sans-serif;
    }
  }

</style>
