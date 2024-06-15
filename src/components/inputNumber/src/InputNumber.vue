<template>
  <div
      @dragstart.prevent
      :class="[
      'c-input-number',
      inputNumberSize? inputNumberSize : '',
      { 'disabled': inputNumberDisabled },
    ]">
    <div
        class="c-input-number-decrease"
        role="button"
        v-repeat-click="decrease"
        :class="{'disabled': minDisabled}"
        @keydown.enter="decrease">-</div>
    <c-input
        ref="input"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="inputNumberDisabled"
        :size="inputNumberSize"
        :max="max"
        :min="min"
        :name="name"
        @keydown.up.native.prevent="increase"
        @keydown.down.native.prevent="decrease"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
        @change="handleInputChange">
    </c-input>
    <div
        class="c-input-number-increase"
        role="button"
        v-repeat-click="increase"
        :class="{'disabled': maxDisabled}"
        @keydown.enter="increase">+</div>
  </div>
</template>
<script>
import Focus from '../../../mixins/focus';
import RepeatClick from '../../../directives/repeat-click';
import formComponent from '../../../mixins/formComponent';

export default {
  name: 'CInputNumber',
  mixins: [Focus('input'), formComponent],
  directives: {
    repeatClick: RepeatClick
  },
  props: {
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    value: {},
    disabled: Boolean,
    size: String,
    name: String,
    label: String,
    placeholder: String,
    precision: {
      type: Number,
      validator(val) {
        return val >= 0 && val === parseInt(val, 10);
      }
    }
  },
  data() {
    return {
      currentValue: null,  // 将初始值改为 null
      userInput: null
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        let newValue = value === undefined || value === null? null : Number(value);  // 处理为 null 情况

        if (newValue!== null) {  // 这里修改为不为 null 的判断
          if (isNaN(newValue)) {
            return;
          }

          if (this.stepStrictly) {
            const stepPrecision = this.getPrecision(this.step);
            const precisionFactor = Math.pow(10, stepPrecision);
            newValue = Math.round(newValue / this.step) * precisionFactor * this.step / precisionFactor;
          }

          if (this.precision!== undefined) {
            newValue = this.toPrecision(newValue, this.precision);
          }
        }
        if (newValue >= this.max) newValue = this.max;
        if (newValue <= this.min) newValue = this.min;
        this.currentValue = newValue;
        this.userInput = null;
        this.$emit('input', newValue);
      }
    }
  },
  computed: {
    minDisabled() {
      return this._decrease(this.value, this.step) < this.min;
    },
    maxDisabled() {
      return this._increase(this.value, this.step) > this.max;
    },
    numPrecision() {
      const { value, step, getPrecision, precision } = this;
      const stepPrecision = getPrecision(step);

      if (precision!== undefined) {
        if (stepPrecision > precision) {
          console.warn('[Canknow Warn][InputNumber]precision should not be less than the decimal places of step');
        }
        return precision;
      }
      else {
        return Math.max(getPrecision(value), stepPrecision);
      }
    },
    inputNumberSize() {
      return this.size || this._formItemSize;
    },
    inputNumberDisabled() {
      return this.disabled ||!!(this.form || {}).disabled;
    },
    displayValue() {
      if (this.userInput!== null) {
        return this.userInput;
      }

      let currentValue = this.currentValue;

      if (typeof currentValue === 'number') {
        if (this.stepStrictly) {
          const stepPrecision = this.getPrecision(this.step);
          const precisionFactor = Math.pow(10, stepPrecision);
          currentValue = Math.round(currentValue / this.step) * precisionFactor * this.step / precisionFactor;
        }

        if (this.precision!== undefined) {
          currentValue = currentValue.toFixed(this.precision);
        }
      }

      return currentValue === null? '' : currentValue;  // 当为 null 时返回空字符串
    }
  },
  methods: {
    toPrecision(num, precision) {
      if (precision === undefined) precision = this.numPrecision;
      return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision));
    },
    getPrecision(value) {
      if (value === undefined || value === null) return 0;  // 处理为 null 情况
      const valueString = value.toString();
      const dotPosition = valueString.indexOf('.');
      let precision = 0;
      if (dotPosition!== -1) {
        precision = valueString.length - dotPosition - 1;
      }
      return precision;
    },
    _increase(val, step) {
      if (typeof val!== 'number' && val!== undefined && val!== null) return this.currentValue;  // 处理为 null 情况

      const precisionFactor = Math.pow(10, this.numPrecision);
      // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
      return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
    },
    _decrease(val, step) {
      if (typeof val!== 'number' && val!== undefined && val!== null) return this.currentValue;  // 处理为 null 情况

      const precisionFactor = Math.pow(10, this.numPrecision);

      return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
    },
    increase() {
      if (this.inputNumberDisabled || this.maxDisabled) return;
      const value = this.value || 0;
      const newVal = this._increase(value, this.step);
      this.setCurrentValue(newVal);
    },
    decrease() {
      if (this.inputNumberDisabled || this.minDisabled) return;
      const value = this.value || 0;
      const newVal = this._decrease(value, this.step);
      this.setCurrentValue(newVal);
    },
    handleBlur(event) {
      this.$emit('blur', event);
    },
    handleFocus(event) {
      this.$emit('focus', event);
    },
    setCurrentValue(newVal) {
      const oldVal = this.currentValue;

      if (typeof newVal === 'number' && this.precision!== undefined) {
        newVal = this.toPrecision(newVal, this.precision);
      }
      if (newVal >= this.max) newVal = this.max;
      if (newVal <= this.min) newVal = this.min;
      if (oldVal === newVal) return;
      this.userInput = null;
      this.$emit('input', newVal);
      this.$emit('change', newVal, oldVal);
      this.currentValue = newVal;
    },
    handleInput(value) {
      this.userInput = value;
    },
    handleInputChange(value) {
      const newVal = value === ''? null : Number(value);  // 处理为空字符串时为 null
      if (!isNaN(newVal) || value === '') {
        this.setCurrentValue(newVal);
      }
      this.userInput = null;
    },
    select() {
      this.$refs.input.select();
    }
  },
  mounted() {
    let innerInput = this.$refs.input.$refs.input;
    innerInput.setAttribute('role','spinbutton');
    innerInput.setAttribute('aria-valuemax', this.max);
    innerInput.setAttribute('aria-valuemin', this.min);
    innerInput.setAttribute('aria-valuenow', this.currentValue === null? '' : this.currentValue);  // 处理为 null 情况
    innerInput.setAttribute('aria-disabled', this.inputNumberDisabled);
  },
  updated() {
    if (!this.$refs ||!this.$refs.input) return;
    const innerInput = this.$refs.input.$refs.input;
    innerInput.setAttribute('aria-valuenow', this.currentValue === null? '' : this.currentValue);  // 处理为 null 情况
  }
};
</script>

