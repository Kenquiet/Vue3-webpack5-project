<template>
  <Menu />
</template>
<script>
import Menu from './view/Menu/index.vue'
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App',
  components: { Menu },
  setup() {

  },
})
</script>

<style lang="scss">
html, body{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#root{
  width: 100% !important;
  height: 100% !important;
}
  .app{
    height: 100%;
    width: 100%;
    background-color: #000;
  }
</style>