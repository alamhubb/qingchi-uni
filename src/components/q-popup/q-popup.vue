<template>
    <view v-if="value" class="q-popup-box">
        <q-mask @click="input(false)">
            <!--        ios端不支持prevent需要用stop代替-->
        </q-mask>
        <view class="h100r flex-row">
            <view class="q-popup" :class="popupClass"
                  @touchmove.stop.prevent
                  @click.stop
            >
                <slot></slot>
            </view>
        </view>
    </view>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Model } from 'vue-property-decorator'

  /*
  显示出来已经选了的城市，给她画上钩
  * */
  @Component
export default class QPopup extends Vue {
    //如果是头顶或者底部则不为width100
    @Prop({ default: '' }) readonly position: string
    @Prop({ default: false }) readonly bottom: boolean
    @Prop({ default: false }) readonly top: boolean
    @Model('input') readonly value: boolean

    @Emit()
    input (value: boolean) {
      return value
    }

    get popupClass () {
      return this.top ? 'top' : this.bottom ? 'bottom' : this.position
    }
}
</script>
