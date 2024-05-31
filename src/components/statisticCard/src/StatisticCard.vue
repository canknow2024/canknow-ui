<template>
  <div class="c-statistic-card">
    <div class="c-statistic-card-content">
      <div class="c-statistic-card-label">{{label}}</div>
      <div class="c-statistic-card-value">
        <slot>{{value}}</slot>
      </div>
    </div>
    <div class="c-statistic-card-extra">
      <slot name="extra"></slot>
    </div>
    <div class="c-statistic-card-footer"><slot name="footer"></slot></div>
  </div>
</template>

<script>
export default {
  name: 'CStatisticCard',
  props: {
    label: null,
    value: null,
  }
};
</script>
