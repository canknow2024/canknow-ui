export default {
  name: 'CMarker',
  props: {
    mark: {
      type: [String, Object]
    }
  },
  render() {
    let label = typeof this.mark === 'string' ? this.mark : this.mark.label;
    return (
      <div class="c-slider-marks-text" style={ this.mark.style || {} }>
        { label }
      </div>
    );
  }
};
