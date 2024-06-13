<template>
  <div
      class="c-steps"
      :class="[
       !simple && '' + direction,
       simple && 'is-simple'
     ]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CSteps',
  props: {
    space: [Number, String],
    active: Number,
    direction: {
      type: String,
      default: 'horizontal'
    },
    alignCenter: Boolean,
    simple: Boolean,
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    }
  },
  data() {
    return {
      steps: [],
      stepOffset: 0
    };
  },
  watch: {
    active(newVal, oldVal) {
      this.$emit('change', newVal, oldVal);
    },

    steps(steps) {
      steps.forEach((child, index) => {
        child.index = index;
      });
    }
  }
};
</script>
