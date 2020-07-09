<template>
  <view class="bg-white px pt-xs">
    <u-swiper :height="swiperHeight" :list="homeSwipers" name="imgUrl" @click="skipWebView"
              :interval="3500"
    ></u-swiper>
  </view>
</template>

<script lang="ts">
import {
  Vue,
  Component
} from 'vue-property-decorator'

import { namespace } from 'vuex-class'

import HomeSwiperVO from '@/model/HomeSwiperVO'
import ConfigMap from '@/const/ConfigMap'
import PageUtil from '@/utils/PageUtil'
import SkipType from '@/const/SkipType'
import { systemModule } from '@/plugins/store'

const appStore = namespace('app')
const configStore = namespace('config')
// todo 后台可控制是否显示轮播图
@Component
export default class TalkSwipersVue extends Vue {
  @appStore.State('homeSwipers') readonly homeSwipers: HomeSwiperVO[]
  @configStore.Getter(ConfigMap.homeUrlKey) homeUrl: string
  swiperHeight: number = ConfigMap.swiperHeightDefault

  skipWebView (current: number) {
    //这里要考虑，跳转其他小程序，跳转其他app，跳转本应用页面
    //区分跳转类型，跳转web，local，小程序，app
    //特殊处理小程序无法跳转app
    const homeSwiper = this.homeSwipers[current]
    //需要跳转
    if (homeSwiper.skip) {
      if (homeSwiper.skipType === SkipType.app) {
        if (systemModule.isMp) {
          PageUtil.navigateToAll(homeSwiper.standType, homeSwiper.standUrl, homeSwiper.name)
        } else {
          PageUtil.navigateToWeb(homeSwiper.skipUrl, homeSwiper.name)
        }
      } else if (homeSwiper.skipType === SkipType.mp) {
        PageUtil.navigateToMp(homeSwiper.skipUrl, homeSwiper.name)
      } else if (homeSwiper.skipType === SkipType.web) {
        PageUtil.navigateToWeb(homeSwiper.skipUrl, homeSwiper.name)
      } else if (homeSwiper.skipType === SkipType.local) {
        PageUtil.navigateTo(homeSwiper.skipUrl)
      } else {
        PageUtil.toWebHome()
      }
    }
  }
}
</script>
