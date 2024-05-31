<template>
  <c-switch v-model="darkMode" active-action-icon="dark" inactive-action-icon="light">
    <icon name="light" slot="open"></icon>
    <icon name="dark" slot="close"></icon>
  </c-switch>
</template>

<script>
export default {
  data () {
    return {
      darkMode: false
    };
  },
  watch: {
    darkMode() {
      this.switch();
    }
  },
  methods: {
    switch() {
      const html = document.querySelector('html');
      
      if (html) {
        if (this.darkMode) {
          html.classList.remove('light');
          html.classList.add('dark');
        }
        else {
          html.classList.remove('dark');
          html.classList.add('light');
        }
      }
    }
  }
};
</script>
