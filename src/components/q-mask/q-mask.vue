<template>
  <view class="q-mask"
        @touchmove.stop.prevent
        @click="click"
  >
    <slot></slot>
  </view>
</template>
<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'

/*
显示出来已经选了的城市，给她画上钩
* */
@Component
export default class QMask extends Vue {
  @Emit()
  click () {
    return ''
  }
}
</script>
