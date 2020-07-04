<template>
  <text class="q-icon" :class="[
      prefixClass?prefixClass:'u-iconfont',
      prefixClass?icon:'uicon-' + icon,
      addClass
      ]"
        :style="{'font-size':size+'rpx','color':color}" @click="click">
  </text>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from 'vue-property-decorator'

@Component
export default class QIcon extends Vue {
  @Prop({ type: [String, Number], default: '24' }) readonly size: string | number
  @Prop({ type: String, default: '' }) readonly icon: string
  @Prop({ type: String }) readonly color: string
  @Prop({ type: String }) readonly addClass: string

  get prefixClass () {
    const prefixs: string[] = this.icon.split('-')
    if (prefixs.length > 1) {
      if (prefixs[0] === 'mdi') {
        return 'mdi'
      }
    }
    return ''
  }

  @Emit()
  click () {
    return ''
  }
}
</script>
