<template>
  <div class="c-statistic-bar-item">
    <div class="c-statistic-bar-item-label">{{label}}</div>
    <div class="c-statistic-bar-item-value">
      <slot>{{value}}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CStatisticBarItem',
  props: {
    label: null,
    value: null
  }
};
</script>
