<template>
  <label class="c-tag" :class="classes" :style="{ backgroundColor: color }" @click="handleClick">
    <icon class="c-tag-icon" :name="icon" v-if="icon"></icon>
    <span class="c-tag-text"><slot></slot></span>
    <icon name="cross" class="c-tag-close" v-if="closable" @click.native="handleClose"></icon>
  </label>
</template>
<script>
import sizeComponent from '../../../mixins/sizeComponent';
import { oneOf } from 'canknow-ui-core/src/utils/assist';
import sizes from '../../../consts/sizes';

export default {
  name: 'CTag',
  mixins: [sizeComponent],
  props: {
    text: String,
    icon: String,
    closable: Boolean,
    scene: {
      type: String,
      default: 'default'
    },
    hit: Boolean,
    disableTransitions: Boolean,
    color: String,
    plain: {
      type: Boolean,
      default: false
    },
    fill: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: Boolean,
    size: {
      validator (value) {
        const result = oneOf(value, sizes);

        if (!result) {
          console.log(value);
        }
        return result;
      },
      default: 'small'
    },
  },
  methods: {
    handleClose(event) {
      event.stopPropagation();
      this.$emit('close', event);
    },
    handleClick(event) {
      this.$emit('click', event);
    }
  },
  computed: {
    classes () {
      return[
        `${this.scene}`,
        `size-${this.size}`,
        {
          plain: this.plain,
          fill: this.fill,
          hit: this.hit,
          closable: this.closable
        }
      ];
    }
  }
};
</script>
