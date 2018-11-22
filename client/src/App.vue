<template lang="pug">
  #app
    .container#title
      h1 {{ toolname }}
    .container#toolset
      .row
        .col-md-8
          .card-columns
            .card.text-white.mb-3.bg-dark(:class="this.online ? '' : 'disabled'")
              .card-header Shutdown
              .card-body
                | Shuts down the {{instanceName}} instance
                ConfirmButton(:disabled="this.online ? '' : 'disabled'", @perform="stopInstance()").btn-lg.btn-danger.btn-block.mt-3 Shutdown
            .card.text-white.mb-3.bg-dark(:class="!this.online ? '' : 'disabled'")
              .card-header Startup
              .card-body
                | Starts the {{instanceName}} instance
                ConfirmButton(:disabled="!this.online ? '' : 'disabled'", @perform="startInstance()").btn-lg.btn-success.btn-block.mt-3 Startup
            .card.text-white.mb-3.bg-dark(:class="this.online ? '' : 'disabled'")
              .card-header Reboot
              .card-body
                | Reboots the {{instanceName}} instance
                ConfirmButton(:disabled="this.online ? '' : 'disabled'", @perform="restartInstance()").btn-lg.btn-success.btn-block.mt-3 Restart
          .card-columns
            .card.text-white.mb-3.bg-dark(:class="!this.online ? '' : 'disabled'")
              .card-header High-performance
              .card-body
                | Sets the {{instanceName}} instance to a high-performance type, make sure to revert later as cost will be much higher. Can only be done with the instance turned off.
                ConfirmButton(:disabled="!this.online ? '' : 'disabled'", @perform="changeInstanceType('large')").btn-lg.btn-warning.btn-block.mt-3 Activate
            .card.text-white.mb-3.bg-dark(:class="!this.online ? '' : 'disabled'")
              .card-header Low-performance
              .card-body
                | Sets the {{instanceName}} instance to a low-performance standby state, reducing costs to practically zero. Can only be done with the instance turned off.
                ConfirmButton(:disabled="!this.online ? '' : 'disabled'", @perform="changeInstanceType('small')").btn-lg.btn-warning.btn-block.mt-3 Activate
          h3 Status
          pre
            | {{ fullInstanceStatus }}
            | {{ instanceTypeStatus }}
        .col-md-4
          .card.mb-3(:class="online ? 'bg-success' : 'bg-danger'")
            .card-body.text-white
              strong
                | {{instanceName}} - {{ online ? 'Online' : 'Offline' }}
          .card.mb-3(:class="isHighPerformance ? 'bg-warning' : 'bg-success'")
            .card-body.text-white
              strong
                | Performance level - {{ isHighPerformance ? 'High' : 'Low' }}
          button(@click="getStatus").btn.btn-outline-primary.mb-3 Refresh Status
          Log(:logdata="logdata")
</template>

<script>
// Components
import Log from './components/Log.vue';
import moment from 'moment';
import ConfirmButton from './components/ConfirmButton.vue';

// Setup stuff
const ls = window.localStorage;

export default {
  name: 'app',
  components: {
    Log,
    ConfirmButton
  },
  data() {
    return {
      toolname: window.toolName,
      instanceName: window.instanceName,
      instanceStatus: '',
      fullInstanceStatus: '',
      instanceTypeStatus: '',
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

    this.getStatus();
  },
  computed: {
    online() {
      return this.instanceStatus.Name === 'running' ? true : false
    },
    isHighPerformance() {
      if (this.instanceTypeStatus == window.largeType) return true;
      if (this.instanceTypeStatus == window.smallType) return false;
      return undefined;
    }
  },
  methods: {
    getStatus() {
      EventBus.$emit('log', "Retrieving instance status", 'info');
      this.$socket.emit('getStatus');
    },
    startInstance() {
      EventBus.$emit('log', "Starting instance", 'info');
      this.$socket.emit('startInstance');
    },
    stopInstance() {
      EventBus.$emit('log', "Stopping instance", 'info');
      this.$socket.emit('stopInstance');
    },
    rebootInstance() {
      EventBus.$emit('log', "Rebooting instance", 'info');
      this.$socket.emit('rebootInstance');
    },
    changeInstanceType(type) {
      EventBus.$emit('log', "Changing instance type to " + type, 'info');
      this.$socket.emit('changeInstanceType', type);
    }
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
      EventBus.$emit("log", "Client connected to server", "info");
      this.$socket.emit('sendstate');
      this.getStatus();
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

    instanceStatus(status) {
      this.fullInstanceStatus = status;
      this.instanceStatus = status.InstanceStatuses[0].InstanceState;
      EventBus.$emit("log", "Instance status received", "success");
    },

    instanceTypeStatus(status) {
      this.instanceTypeStatus = status.InstanceType.Value;
      EventBus.$emit("log", "Instance type status received", "success");
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

  .card.disabled {
    opacity: .5;
  }

</style>
