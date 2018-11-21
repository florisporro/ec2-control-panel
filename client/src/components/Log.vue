<template lang="pug">
  #log
    h3 Log
    pre.debuglog.well
      LogEntry(v-for="(entry, index) in logdata.slice().reverse()", :entry="entry", :key="index")

</template>

<script>
  import moment from 'moment';

  const LogEntry = {
    props: ['entry'],
    template: '<span :class="entry.type">{{ timestamp }} - {{entry.message}}</span>\n',
    computed: {
      timestamp: function() {
        return moment(this.entry.timestamp).format("HH:mm:ss");
      }
    }
  };

  export default {
    components: {
      LogEntry
    },
    props: ['logdata']
  }
</script>

<style lang="scss">
  pre.debuglog {
    height: 400px;
    background: rgba(0,0,0,.7);
    color: white;
    padding: .5em;
  }
  .debuglog > span {
    border-left: 4px solid #eee;
    padding-left: .5em;
    display: block;
  }
  .debuglog > span.warning {
    border-left-color: #f0ad4e;
  }
  .debuglog > span.error {
    border-left-color: #d9534f;
  }
  .debuglog > span.info {
    border-left-color: #5bc0de;
  }
  .debuglog > span.success {
    border-left-color: #5cb85c;
  }
</style>