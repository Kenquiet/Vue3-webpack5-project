<template>
  <div class="title">{{ title }}</div>
  <div class="opte" @click="doubleClick">第二个根节点</div>
  <div class="opte" @click="resetClick">第三个根节点</div>
  <div class="title">{{ name }}</div>
  <div class="opte" @click="changeName">巴啦啦小魔仙</div>
  <div class="title">{{ mergeData }}</div>
</template>
<script>
import { watch, reactive, toRefs, onMounted, computed } from 'vue';
export default {
  name: 'App',
  setup() {
    const state = reactive({
      title: '现在开始测试 vue3.0 打包'
    })
    onMounted(() => {
      setTimeout(() => {
        state.title = '现在开始测试 vue3.0 数据动态渲染'
      }, 2000)
    })
    watch(
      () => state.title,
      (val, oldVal) => {
        console.log(val, oldVal);
      }, { lazy: false } // 第一次创建不监听
    )
    const doubleClick = () => {
      state.title = '我点击了开始测试 vue3.0 数据动态更新，怎么样不错吧'
    }
    const resetClick = () => {
      state.title = '我马上把他变回来';
      setTimeout(() => {
        state.title = '现在开始测试 vue3.0 打包'
      }, 1000)
    }

    const data = reactive({
      name: '菜鸡小王子'
    })
    watch(
      () => data.name,
      (val, oldVal) => {
        console.log(val, oldVal)
      },
      { lazy: false }
    )
    const changeName = () => {
      data.name = '伏虎小王子'
    }
    const mergeData = computed(() => state.title + data.name)
    return {
      ...toRefs(state),
      ...toRefs(data),
      doubleClick, resetClick, changeName, mergeData
    }
  }
}
</script>

<style>
.title{
  font-size: 20px;
  color: black;
}
.opte {
  cursor: pointer
}
</style>