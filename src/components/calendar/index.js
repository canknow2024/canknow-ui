import Calendar from './src/Calendar';

Calendar.install = function(Vue) {
  Vue.component(Calendar.name, Calendar);
};

export default Calendar;
