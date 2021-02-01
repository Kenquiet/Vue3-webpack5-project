<template>
<div class="meun">
  <div class="meun-left">
    <div class="meun-left-logo">logo</div>
    <div class="meun-list">
      <NavMenu :menu-data="menuData" />
    </div>
  </div>
  <div class="meun-right">
    <div class="meun-header">
      <HeaderMenu @select-menu="onSelectMenu" /> 
    </div>
    <div class="meun-content">
      <router-view></router-view>
    </div>
  </div>
</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import NavMenu from './NavMenu.vue'
import HeaderMenu from './HeaderMenu.vue'
export default defineComponent({
  name: 'Menu',
  components: { NavMenu, HeaderMenu },
  setup() {
    const menuData = [{
      name: '权限管理',
      icon: 'el-icon-menu',
      children: [
        {
          name: '用户管理',
          icon: 'el-icon-menu',
          router: '/user',
          children: []
        },{
          name: '角色管理',
          icon: 'el-icon-menu',
          router: '/role',
          children: []
        }
      ]
    }, {
      name: '系统参数',
      icon: 'el-icon-document',
      router: '/system/options',
      children: []
    }]
    function onSelectMenu(router: any, pathIndex: any) {
      console.log('父组件' , router, pathIndex)
    }
    return {
      menuData,
      onSelectMenu
    }
  }
})
</script>  
<style lang="scss">
.meun{
  width: 100%;
  height: 100%;
  display: flex;
  .meun-left{
    width: 178px;
    height: 100%;
    .meun-left-logo{
      height: 60px;
      width: 100%;
      background-color: #ccc;
    }
    .meun-list{
      height: calc(100% - 60px);
      width: 100%;
      background-color: #545c64;
    }
  }
  .meun-right{
    width: calc(100% - 178px);
    height: 100%;
    .meun-header{
      height: 60px;
      background-color: #545c64;
      width: 100%;
    }
    .meun-content{
      height: calc(100% -60px);
      width: 100%;
    }
  }
}
</style>