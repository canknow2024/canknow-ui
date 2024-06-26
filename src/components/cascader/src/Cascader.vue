<template>
  <div ref="reference"
        class="c-cascader"
       :class="[realSize && `c-cascader-${realSize}`, { 'disabled': isDisabled, block: block } ]"
       v-clickoutside="() => toggleDropDownVisible(false)"
       @mouseenter="inputHover = true"
       @mouseleave="inputHover = false"
       @click="() => toggleDropDownVisible(readonly ? undefined : true)"
       @keydown="handleKeyDown">

    <c-input ref="input"
             v-model="multiple ? presentText : inputValue"
             :size="realSize"
             :placeholder="placeholder"
             :readonly="readonly"
             :disabled="isDisabled"
             :validate-event="false"
             :class="{ 'focus': dropDownVisible }"
             @focus="handleFocus"
             @blur="handleBlur"
             @input="handleInput">
      <template slot="suffix">
        <icon v-if="clearBtnVisible"
              key="clear"
              name="remove-circle"
              class="input-icon input-clear"
              @click.stop.native="handleClear"></icon>
        <icon v-else
              key="arrow-down"
              name="down"
              class="input-icon icon-arrow-down"
              :class="[dropDownVisible && 'reverse' ]"
              @click.stop.native="toggleDropDownVisible()"></icon>
      </template>
    </c-input>

    <div v-if="multiple" class="c-cascader-tags">
      <c-tag v-for="tag in presentTags"
           :key="tag.key"
           type="info"
           :size="tagSize"
           :hit="tag.hitState"
           :closable="tag.closable"
           disable-transitions
           @close="deleteTag(tag)">
        <span>{{ tag.text }}</span>
      </c-tag>
      <input v-if="filterable && !isDisabled"
             v-model.trim="inputValue"
             type="text"
             class="c-cascader-search-input"
             :placeholder="presentTags.length ? '' : placeholder"
             @input="e => handleInput(inputValue, e)"
             @click.stop="toggleDropDownVisible(true)"
             @keydown.delete="handleDelete">
    </div>
    <transition name="zoom-in-top" @after-leave="handleDropdownLeave">
      <div v-show="dropDownVisible"
           ref="popper"
           class="c-cascader-dropdown c-popper"
           :class="[popperClass]">
        <cascader-panel ref="panel"
                        v-show="!filtering"
                        v-model="checkedValue"
                        :options="options"
                        :props="config"
                        :border="false"
                        :render-label="$scopedSlots.default"
                        @expand-change="handleExpandChange"
                        @close="toggleDropDownVisible(false)"></cascader-panel>
        <c-scrollbar ref="suggestionPanel"
                   v-if="filterable"
                   v-show="filtering"
                   tag="ul"
                   class="c-cascader-suggestion-panel"
                   view-class="c-cascader-suggestion-list"
                   @keydown.native="handleSuggestionKeyDown">
          <template v-if="suggestions.length">
            <li v-for="(item, index) in suggestions"
                :key="item.uid"
                :class="['c-cascader-suggestion-item', item.checked && 'checked']"
                :tabindex="-1"
                @click="handleSuggestionClick(index)">
              <span>{{ item.text }}</span>
              <icon name="success" v-if="item.checked" class="icon-check"></icon>
            </li>
          </template>
          <slot v-else name="empty">
            <li class="c-cascader-empty-text">{{ t('core.cascader.noMatch') }}</li>
          </slot>
        </c-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
import Popper from './../../../utils/vue-popper';
import Emitter from 'canknow-ui-core/src/mixins/emitter';
import Locale from '../../../mixins/locale';
import Migrating from '../../../mixins/migrating';
import CascaderPanel from './../../cascaderPanel';
import AriaUtils from '../../../utils/aria-utils';
import { t } from '../../../locale';
import { kebabCase } from '../../../utils/util';
import { debounce, isEmpty, isEqual, isFunction, isUndefined } from 'canknow-core/src/libs';
import { isDef } from '../../../utils/shared';
import { addResizeListener, removeResizeListener } from '../../../utils/resize-event';
import clickoutside from 'canknow-ui-core/src/directives/clickoutside';

const { keys: KeyCode } = AriaUtils;
const MigratingProps = {
  expandTrigger: {
    newProp: 'expandTrigger',
    type: String
  },
  changeOnSelect: {
    newProp: 'checkStrictly',
    type: Boolean
  },
  hoverThreshold: {
    newProp: 'hoverThreshold',
    type: Number
  }
};

const PopperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    visibleArrow: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    arrowOffset: Popper.props.arrowOffset,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions,
    transformOrigin: Popper.props.transformOrigin
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
};

const InputSizeMap = {
  medium: 36,
  small: 32,
  mini: 28
};

export default {
  name: 'CCascader',
  directives: { clickoutside },
  mixins: [PopperMixin, Emitter, Locale, Migrating],
  inject: {
    form: {
      default: ''
    },
    formItem: {
      default: ''
    }
  },
  components: {
    CascaderPanel
  },
  props: {
    value: {},
    options: Array,
    props: Object,
    size: String,
    placeholder: {
      type: String,
      default: () => t('core.cascader.placeholder')
    },
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    filterMethod: Function,
    separator: {
      type: String,
      default: ' / '
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    collapseTags: Boolean,
    debounce: {
      type: Number,
      default: 300
    },
    beforeFilter: {
      type: Function,
      default: () => (() => {})
    },
    popperClass: String
  },
  data() {
    return {
      dropDownVisible: false,
      checkedValue: this.value,
      inputHover: false,
      inputValue: null,
      presentText: null,
      presentTags: [],
      checkedNodes: [],
      filtering: false,
      suggestions: [],
      inputInitialHeight: 0,
      pressDeleteCount: 0
    };
  },
  computed: {
    realSize() {
      const _elFormItemSize = (this.formItem || {}).formItemSize;
      return this.size || _elFormItemSize || this.$CANKNOW.config.size;
    },
    tagSize() {
      return ['small', 'smaller'].indexOf(this.realSize) > -1 ? 'smaller' : 'small';
    },
    isDisabled() {
      return this.disabled || (this.form || {}).disabled;
    },
    config() {
      const config = this.props || {};
      const { $attrs } = this;

      Object.keys(MigratingProps)
        .forEach(oldProp => {
          const { newProp, type } = MigratingProps[oldProp];
          let oldValue = $attrs[oldProp] || $attrs[kebabCase(oldProp)];
          if (isDef(oldProp) && !isDef(config[newProp])) {
            if (type === Boolean && oldValue === '') {
              oldValue = true;
            }
            config[newProp] = oldValue;
          }
        });

      return config;
    },
    multiple() {
      return this.config.multiple;
    },
    leafOnly() {
      return !this.config.checkStrictly;
    },
    readonly() {
      return !this.filterable || this.multiple;
    },
    clearBtnVisible() {
      if (!this.clearable || this.isDisabled || this.filtering || !this.inputHover) {
        return false;
      }
      return this.multiple ? !!this.checkedNodes.filter(node => !node.isDisabled).length : !!this.presentText;
    },
    panel() {
      return this.$refs.panel;
    }
  },

  watch: {
    disabled() {
      this.computePresentContent();
    },
    value(value) {
      if (!isEqual(value, this.checkedValue)) {
        this.checkedValue = value;
        this.computePresentContent();
      }
    },
    checkedValue(checkedValue) {
      const { value, dropDownVisible } = this;
      const { checkStrictly, multiple } = this.config;

      if (!isEqual(checkedValue, value) || isUndefined(value)) {
        this.computePresentContent();

        // hide dropdown when single mode
        if (!multiple && !checkStrictly && dropDownVisible) {
          this.toggleDropDownVisible(false);
        }

        this.$emit('input', checkedValue);
        this.$emit('change', checkedValue);
        this.dispatch('CFormItem', 'form.change', [checkedValue]);
      }
    },
    options: {
      handler: function() {
        this.$nextTick(this.computePresentContent);
      },
      deep: true
    },
    presentText(value) {
      this.inputValue = value;
    },
    presentTags(value, oldVal) {
      if (this.multiple && (value.length || oldVal.length)) {
        this.$nextTick(this.updateStyle);
      }
    },
    filtering(value) {
      this.$nextTick(this.updatePopper);
    }
  },

  mounted() {
    const { input } = this.$refs;

    if (input && input.$el) {
      this.inputInitialHeight = input.$el.offsetHeight || InputSizeMap[this.realSize] || 40;
    }

    if (!this.isEmptyValue(this.value)) {
      this.computePresentContent();
    }

    this.filterHandler = debounce(() => {
      const { inputValue } = this;

      if (!inputValue) {
        this.filtering = false;
        return;
      }

      const before = this.beforeFilter(inputValue);
      if (before && before.then) {
        before.then(this.getSuggestions);
      }
      else if (before !== false) {
        this.getSuggestions();
      }
      else {
        this.filtering = false;
      }
    }, this.debounce);

    addResizeListener(this.$el, this.updateStyle);
  },

  beforeDestroy() {
    removeResizeListener(this.$el, this.updateStyle);
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          'expand-trigger': 'expand-trigger is removed, use `props.expandTrigger` instead.',
          'change-on-select': 'change-on-select is removed, use `props.checkStrictly` instead.',
          'hover-threshold': 'hover-threshold is removed, use `props.hoverThreshold` instead'
        },
        events: {
          'active-item-change': 'active-item-change is renamed to expand-change'
        }
      };
    },
    toggleDropDownVisible(visible) {
      if (this.isDisabled) {
        return;
      }

      const { dropDownVisible } = this;
      const { input } = this.$refs;
      visible = isDef(visible) ? visible : !dropDownVisible;

      if (visible !== dropDownVisible) {
        this.dropDownVisible = visible;

        if (visible) {
          this.$nextTick(() => {
            this.updatePopper();
            this.panel.scrollIntoView();
          });
        }
        input.$refs.input.setAttribute('aria-expanded', visible);
        this.$emit('visible-change', visible);
      }
    },
    handleDropdownLeave() {
      this.filtering = false;
      this.inputValue = this.presentText;
      this.doDestroy();
    },
    handleKeyDown(event) {
      switch (event.keyCode) {
        case KeyCode.enter:
          this.toggleDropDownVisible();
          break;
        case KeyCode.down:
          this.toggleDropDownVisible(true);
          this.focusFirstNode();
          event.preventDefault();
          break;
        case KeyCode.esc:
        case KeyCode.tab:
          this.toggleDropDownVisible(false);
          break;
      }
    },
    handleFocus(e) {
      this.$emit('focus', e);
    },
    handleBlur(e) {
      this.$emit('blur', e);
    },
    handleInput(value, event) {
      !this.dropDownVisible && this.toggleDropDownVisible(true);

      if (event && event.isComposing) return;
      if (value) {
        this.filterHandler();
      }
      else {
        this.filtering = false;
      }
    },
    handleClear() {
      this.presentText = '';
      this.panel.clearCheckedNodes();
    },
    handleExpandChange(value) {
      this.$nextTick(this.updatePopper.bind(this));
      this.$emit('expand-change', value);
      this.$emit('active-item-change', value); // Deprecated
    },
    focusFirstNode() {
      this.$nextTick(() => {
        const { filtering } = this;
        const { popper, suggestionPanel } = this.$refs;
        let firstNode = null;

        if (filtering && suggestionPanel) {
          firstNode = suggestionPanel.$el.querySelector('.c-cascader-suggestion-item');
        }
        else {
          const firstMenu = popper.querySelector('.c-cascader-menu');
          firstNode = firstMenu.querySelector('.c-cascader-node[tabindex="-1"]');
        }

        if (firstNode) {
          firstNode.focus();
          !filtering && firstNode.click();
        }
      });
    },
    computePresentContent() {
      // nextTick is required, because checked nodes may not change right now
      this.$nextTick(() => {
        if (this.config.multiple) {
          this.computePresentTags();
          this.presentText = this.presentTags.length ? ' ' : null;
        }
        else {
          this.computePresentText();
        }
      });
    },
    isEmptyValue(val) {
      const { multiple } = this;
      const { emitPath } = this.panel.config;

      if (multiple || emitPath) {
        return isEmpty(val);
      }
      return false;
    },
    computePresentText() {
      const { checkedValue, config } = this;
      if (!isEmpty(checkedValue)) {
        const node = this.panel.getNodeByValue(checkedValue);
        if (node && (config.checkStrictly || node.isLeaf)) {
          this.presentText = node.getText(this.showAllLevels, this.separator);
          return;
        }
      }
      this.presentText = null;
    },
    computePresentTags() {
      const { isDisabled, leafOnly, showAllLevels, separator, collapseTags } = this;
      const checkedNodes = this.getCheckedNodes(leafOnly);
      const tags = [];

      const genTag = node => ({
        node,
        key: node.uid,
        text: node.getText(showAllLevels, separator),
        hitState: false,
        closable: !isDisabled && !node.isDisabled
      });

      if (checkedNodes.length) {
        const [first, ...rest] = checkedNodes;
        const restCount = rest.length;
        tags.push(genTag(first));

        if (restCount) {
          if (collapseTags) {
            tags.push({
              key: -1,
              text: `+ ${restCount}`,
              closable: false
            });
          }
          else {
            rest.forEach(node => tags.push(genTag(node)));
          }
        }
      }

      this.checkedNodes = checkedNodes;
      this.presentTags = tags;
    },
    getSuggestions() {
      let { filterMethod } = this;

      if (!isFunction(filterMethod)) {
        filterMethod = (node, keyword) => node.text.includes(keyword);
      }

      const suggestions = this.panel.getFlattedNodes(this.leafOnly).filter(node => {
        if (node.isDisabled) {
          return false;
        }
        node.text = node.getText(this.showAllLevels, this.separator) || '';
        return filterMethod(node, this.inputValue);
      });

      if (this.multiple) {
        this.presentTags.forEach(tag => {
          tag.hitState = false;
        });
      }
      else {
        suggestions.forEach(node => {
          node.checked = isEqual(this.checkedValue, node.getValueByOption());
        });
      }

      this.filtering = true;
      this.suggestions = suggestions;
      this.$nextTick(this.updatePopper);
    },
    handleSuggestionKeyDown(event) {
      const { keyCode, target } = event;
      switch (keyCode) {
        case KeyCode.enter:
          target.click();
          break;
        case KeyCode.up:
          const prev = target.previousElementSibling;
          prev && prev.focus();
          break;
        case KeyCode.down:
          const next = target.nextElementSibling;
          next && next.focus();
          break;
        case KeyCode.esc:
        case KeyCode.tab:
          this.toggleDropDownVisible(false);
          break;
      }
    },
    handleDelete() {
      const { inputValue, pressDeleteCount, presentTags } = this;
      const lastIndex = presentTags.length - 1;
      const lastTag = presentTags[lastIndex];
      this.pressDeleteCount = inputValue ? 0 : pressDeleteCount + 1;

      if (!lastTag) {
        return;
      }

      if (this.pressDeleteCount) {
        if (lastTag.hitState) {
          this.deleteTag(lastIndex);
        }
        else {
          lastTag.hitState = true;
        }
      }
    },
    handleSuggestionClick(index) {
      const { multiple } = this;
      const targetNode = this.suggestions[index];

      if (multiple) {
        const { checked } = targetNode;
        targetNode.doCheck(!checked);
        this.panel.calculateMultiCheckedValue();
      }
      else {
        this.checkedValue = targetNode.getValueByOption();
        this.toggleDropDownVisible(false);
      }
    },
    deleteTag(tag) {
      const { checkedValue } = this;
      const current = tag.node.getValueByOption();
      const value = checkedValue.find(n => isEqual(n, current));
      this.checkedValue = checkedValue.filter(n => !isEqual(n, current));
      this.$emit('remove-tag', value);
    },
    updateStyle() {
      const { $el, inputInitialHeight } = this;
      if (this.$isServer || !$el) return;

      const { suggestionPanel } = this.$refs;
      const inputInner = $el.querySelector('.c-input-input');

      if (!inputInner) return;

      const tags = $el.querySelector('.c-cascader-tags');
      let suggestionPanelEl = null;

      if (suggestionPanel && (suggestionPanelEl = suggestionPanel.$el)) {
        const suggestionList = suggestionPanelEl.querySelector('.c-cascader-suggestion-list');
        suggestionList.style.minWidth = inputInner.offsetWidth + 'px';
      }

      if (tags) {
        const offsetHeight = Math.round(tags.getBoundingClientRect().height);
        inputInner.style.height = Math.max(offsetHeight + 6, inputInitialHeight) + 'px';

        if (this.dropDownVisible) {
          this.updatePopper();
        }
      }
    },

    /**
     * public methods
     */
    getCheckedNodes(leafOnly) {
      return this.panel.getCheckedNodes(leafOnly);
    }
  }
};
</script>

