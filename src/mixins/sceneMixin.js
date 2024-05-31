import { oneOf } from 'canknow-ui-core/src/utils/assist';

export default {
  props: {
    scene: {
      validator (value) {
        return oneOf(value, ['default', 'primary', 'info', 'success', 'warning', 'danger', 'error']);
      },
      default: 'default'
    },
  }
};
