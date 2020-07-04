<template>
  <view class="q-bar" :class="{'btr-lg':round}" @click="click">
    <slot></slot>
  </view>
</template>
<script lang="ts">
import { Vue, Component, Emit, Prop } from 'vue-property-decorator'

/*
显示出来已经选了的城市，给她画上钩
* */
@Component
export default class QBar extends Vue {
  @Prop({ default: false }) readonly round: boolean

  @Emit()
  click () {
    return ''
  }
}
</script>
