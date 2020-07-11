//    在 types/vue.d.ts 里 Vue 有构造函数类型

import UniUtils from '@/utils/UniUtils'

declare module 'vue/types/vue' {
// 3. 声明为 Vue 补充的东西
  interface Vue {
    $utils: UniUtils
  }
}
