import StatisticBar from './src/StatisticBar';
import StatisticBarItem from './src/StatisticBarItem.vue';

StatisticBar.install = function(Vue) {
  Vue.component(StatisticBar.name, StatisticBar);
  Vue.component(StatisticBarItem.name, StatisticBarItem);
};

export default StatisticBar;
