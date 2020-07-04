<template>
  <view class="q-row-bar" @click="click">
    <slot></slot>
  </view>
</template>
<script lang="ts">
//和bar的区别为行内的bar，没必要通过一个属性就行，没必要建两个bar
import { Vue, Component, Emit } from 'vue-property-decorator'

/*
显示出来已经选了的城市，给她画上钩
* */
@Component
export default class QRowBar extends Vue {
  @Emit()
  click () {
    return ''
  }
}
</script>
