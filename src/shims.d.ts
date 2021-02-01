// 因为ts 只能理解 .ts文件名后缀，所以必须要进行配置才可以在ts 文件里面引用 .vue文件
declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
} 