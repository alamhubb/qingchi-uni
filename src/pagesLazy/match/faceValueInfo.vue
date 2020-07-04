<template>
  <view class="bg-white h100vh">
    <view class="article">
      <view class="text-xl">颜值分介绍</view>
      <view class="pt-0">
        颜值分是根据您被喜欢的次数计算的，喜欢您的人越多，您的颜值分越高
      </view>
      <view class="text-xl">颜值分计算</view>
      <view class="pt-0">
        您的基础颜值分 + vip加成（如果您开通了vip功能，将额外享受vip颜值分加成）
      </view>
      <view class="text-xl">联系客服</view>
      <view class="pt-0">
        有任何问题与建议都可以联系客服微博：{{wbService}}，微信或qq:491369310
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import UserVO from '@/model/user/UserVO'
import { namespace } from 'vuex-class'

const configStore = namespace('config')

@Component
export default class FaceValueInfoVue extends Vue {
  @Prop() user: UserVO
  @configStore.Getter('wbService') readonly wbService: string
}
</script>
