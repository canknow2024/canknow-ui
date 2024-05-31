import Popper from '../../utils/popper';

export default {
  props: {
    placement: {
      type: String,
      default: 'bottom'
    },
    boundariesPadding: {
      type: Number,
      default: 5
    },
    reference: null,
    popper: null,
    offset: {
      default: 0
    },
    value: {
      type: Boolean,
      default: false
    },
    transition: String,
    options: {
      type: Object,
      default () {
        return {
        };
      }
    }
  },
  data () {
    return {
      visible: this.value
    };
  },
  render(createElement, context) {
    return null;
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.visible = value;
        this.$emit('input', value);
      }
    },
    visible(value) {
      if (value) {
        this.updatePopper();
        this.$emit('popper-show');
      }
      else {
        this.$emit('popper-hide');
      }
      this.$emit('input', value);
    }
  },
  methods: {
    createPopper() {
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.placement)) {
        return;
      }
      const options = this.options;
      const popper = this.popper || this.$refs.popper;
      const reference = this.reference || this.$refs.reference;
      if (!popper || !reference) {
        return;
      }

      if (this.popperJS && this.popperJS.hasOwnProperty('destroy')) {
        this.popperJS.destroy();
      }
      options.placement = this.placement;

      options.onCreate =()=>{
        this.$nextTick(this.updatePopper);
        this.$emit('created', this);
      };
      this.popperJS = new Popper(reference, popper, options);
    },
    updatePopper() {
      this.popperJS ? this.popperJS.update() : this.createPopper();
    },
    doDestroy() {
      if (this.visible) {
        return;
      }
      this.popperJS.destroy();
      this.popperJS = null;
    },
    resetTransformOrigin(popper) {
      let placementMap = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
      let placement = popper._popper.getAttribute('x-placement').split('-')[0];
      let origin = placementMap[placement];
      popper._popper.style.transformOrigin = ['top', 'bottom'].indexOf(placement) > -1 ? `center ${ origin }` : `${ origin } center`;
    }
  },
  updated (){
    this.$nextTick(()=>this.updatePopper());
  },
  beforeDestroy() {
    if (this.popperJS) {
      this.popperJS.destroy();
    }
  }
};