<template lang="pug">
  button(@click="perform", :disabled="isDisabled")
    slot(v-if="(this.clicked == 0) && (!this.performing)")
    | {{ this.clicked == 1 ? 'Are you sure?' : '' }}
    font-awesome-icon.fa-spin(icon="spinner", v-if="this.performing")
</template>

<script>
  export default {
    name: 'ConfirmButton',
    data() {
      return {
        clicked: 0,
        performing: false
      }
    },
    props: ['actionName', 'disabled'],

    computed: {
      isDisabled: function() {
        if (this.disabled) return 'disabled';
        if (this.performing) return 'disabled';
        return undefined;
      },
      text: function() {
        if (this.clicked == 0) return this.actionName;
        if (this.clicked == 1) return "Are you sure?";
      }
    },
    methods: {
      perform() {
        this.clicked++;
        if (this.clicked == 2) {
          this.clicked = 0;
          this.performing = true;
          this.$emit('perform');
          setTimeout(() => {
            this.performing = false;
          }, 5000);
        }
      }
    }
  }
</script>