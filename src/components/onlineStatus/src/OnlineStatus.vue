<template>
    <span class="c-online-status" :class="classes">
        <slot></slot>
        <sub class="c-online-status-dot"></sub>
    </span>
</template>

<script>
export default {
  name: 'COnlineStatus',
  props: {
    className: String,
    status: null,
    block: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    },
    emphasize: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes () {
      return [this.size, {
        block: this.block,
        online: !!this.status,
        offline: !this.status,
        emphasize: this.emphasize
      }];
    }
  }
};
</script>

