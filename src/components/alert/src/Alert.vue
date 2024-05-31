<template>
  <transition name="fade">
    <div class="c-alert" :class="classes" v-if="show">
      <slot></slot>
      <c-container-close-button class="c-alert-close-button" v-if="closable" @click="close"></c-container-close-button>
    </div>
  </transition>
</template>
<script>
import sceneMixin from '../../../mixins/sceneMixin';

export default {
  name: 'CAlert',
  mixins: [sceneMixin],
  props: {
    closable: {
      type: Boolean,
      default: false
    },
    radius: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: true
    };
  },
  computed: {
    classes() {
      return [
        this.scene,
        { dismissible: this.closable, radius: this.radius }
      ];
    }
  },
  methods: {
    close (e) {
      this.show = false;
      this.$emit('close', e);
    }
  }
};
</script>
