<template>
   <el-menu
      :uniqueOpened="true"
      class="c-nav-menu"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <template v-for="(menu, index) in menuData" :key="index">
        <el-submenu v-if="menu.children.length > 0">
          <template #title>
            <i v-if="menu.icon" :class="menu.icon"></i>
            <span>{{menu.name}}</span>
          </template>
          <el-menu-item
            v-for="child in menu.children"
            :key="child.id"
            :index="child.router"
            >{{child.name}}</el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="menu.router" >
          <i v-if="menu.icon" :class="menu.icon"></i>
          <template #title>{{menu.name}}</template>
        </el-menu-item>
      </template>
    </el-menu>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'NavMenu',
  props: {
    menuData: {}
  },
  setup() {
    const handleOpen = () => {

    }
    const handleClose = () => {

    }
    return {
      handleOpen, handleClose
    }
  }
})
</script>  

<style lang="scss">
.c-nav-menu{
  max-width: 100%;
  border: 0px !important;
  .el-submenu .el-menu-item{
    min-width: 0px !important;
  }
}
</style>