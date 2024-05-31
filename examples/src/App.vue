<template>
  <router-view></router-view>
</template>
<script>
export default {
  name: 'App'
};
</script>
<style lang="scss">
@import "./styles/index";

body {
  height: 100%;
  color: var(--c-text-color-regular);
  background-color: var(--c-background-color-page);
}
</style>
