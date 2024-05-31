<template>
  <a v-if="to"
     :class="classes"
     :disabled="disabled"
     :href="linkUrl"
     :target="target"
     @click.exact="handleClickLink($event, false)"
     @click.ctrl="handleClickLink($event, true)"
     @click.meta="handleClickLink($event, true)">
    <icon class="c-button-loading-icon c-icon-loading" :name="loadingIcon" v-if="loading"></icon>
    <icon :name="icon" v-else-if="icon"></icon>
    <label class="c-button-label" v-if="$slots.default">
      <slot v-if="!showLoadingText"></slot>
      <span v-else>{{loadingText}}</span>
    </label>
  </a>
  <component
      v-else
      :is="tag"
      :type="htmlType"
      :class="classes"
      :disabled="disabled||loading"
      @click="handleClickLink">
    <icon class="c-button-loading-icon c-icon-loading" :name="loadingIcon" v-if="loading"></icon>
    <icon :name="icon" v-else-if="icon"></icon>
    <label class="c-button-label" v-if="$slots.default">
      <slot v-if="!showLoadingText"></slot>
      <span v-else>{{loadingText}}</span>
    </label>
  </component>
</template>
<script>
import { oneOf } from 'canknow-ui-core/src/utils/assist';
import mixinsLink from '../../../mixins/link';
import sceneMixin from '../../../mixins/sceneMixin';
import formComponent from '../../../mixins/formComponent';

export default {
  name: 'CButton',
  mixins: [ mixinsLink, sceneMixin, formComponent ],
  props: {
    tag: {
      type: String,
      default: 'button'
    },
    loadingIcon: {
      type: String,
      default: 'loading'
    },
    long: Boolean,
    bold: Boolean,
    dashed: Boolean,
    fill: Boolean,
    loading: Boolean,
    ghost: Boolean,
    text: Boolean,
    loadingText: {
      type: String
    },
    disabled: Boolean,
    htmlType: {
      default: 'button',
      validator (value) {
        return oneOf(value, ['button', 'submit', 'reset']);
      }
    },
    icon: {
      type: String,
      default: ''
    },
    plain: Boolean,
    type: {
      type: String,
      default: 'text'
    }
  },
  computed: {
    showLoadingText(){
      return this.loadingText && this.loading;
    },
    classes () {
      return [
        'c-button',
        `c-button-${this.type}`,
        this.scene,
        {
          ...this.formComponentClasses,
          long: !!this.long,
          bold: !!this.bold,
          loading: !!this.loading,
          bordered: !!this.border,
          dashed: !!this.dashed,
          fill: !!this.fill,
          ghost: !!this.ghost,
          text: !!this.text,
          plain: !!this.plain,
          disabled: !!this.disabled
        }
      ];
    }
  },
  methods: {
    // Ctrl or CMD and click, open in new window when use `to`
    handleClickLink (event, new_window = false) {
      this.$emit('click', event);
      this.handleCheckClick(event, new_window);
    }
  },
};
</script>
