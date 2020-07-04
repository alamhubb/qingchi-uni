<template>
    <view class="q-row">
        <slot></slot>
    </view>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

  /*
  显示出来已经选了的城市，给她画上钩
  * */
  @Component
export default class QRow extends Vue {

}
</script>
