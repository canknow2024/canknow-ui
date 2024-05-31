<template>
  <span class="c-status" :class="classes">
  <slot></slot>
</span>
</template>

<script>
export default {
  name: 'Status',
  props: {
    type: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    classes () {

    }
  }
};
</script>
