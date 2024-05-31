import sizeComponent from './sizeComponent';

export default {
  mixins: [sizeComponent],
  props: {
    name: String,
    block: Boolean,
    border: Boolean,
    circle: Boolean,
    round: Boolean
  },
  inject: {
    form: {
      default: ''
    },
    formItem: {
      default: ''
    }
  },
  computed: {
    _formItemSize() {
      return (this.formItem || {}).formItemSize;
    },
    formComponentSize () {
      return this.size || this._formItemSize || this.$CANKNOW.config.size;
    },
    formComponentClasses () {
      return {
        [this.formComponentSize]: !!this.formComponentSize,
        block: !!this.block,
        circle: !!this.circle,
        round: !!this.round,
        radius: !!this.radius,
      };
    }
  }
};
