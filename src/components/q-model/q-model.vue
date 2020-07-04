<template>
    <view class="q-modal"
          @touchmove.stop.prevent
          @click.stop
    >
        <slot></slot>
    </view>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

  /*
  显示出来已经选了的城市，给她画上钩
  * */
  @Component
export default class QModal extends Vue {
  //如果是头顶或者底部则不为width100

}
</script>
