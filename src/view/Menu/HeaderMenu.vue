<template>
  <el-menu
    :default-active="activeIndex2"
    class="c-header-menu"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
  <el-menu-item index="1">基础系统</el-menu-item>
  <el-menu-item index="2">仓库系统</el-menu-item>
  <el-menu-item index="3">订单系统</el-menu-item>
</el-menu>
</template>
<script>
import {
  defineComponent, reactive, toRefs, getCurrentInstance
} from 'vue'
export default defineComponent({
  name: 'HeaderMenu',
  emits: ['select-menu'],
  setup() {
    const { ctx } = getCurrentInstance()
    const state = reactive({
      activeIndex2: '1',
    })
    function handleSelect(index, keyPath) {
      ctx.$emit('select-menu', index, keyPath)
    }
    return {
      ...toRefs(state),
      handleSelect
    }
  }
})
</script>
<style lang="scss">
.c-header-menu{
  max-width: 100%;
  border: 0px !important;
  .el-submenu .el-menu-item{
    min-width: 0px !important;
  }
}
</style>
