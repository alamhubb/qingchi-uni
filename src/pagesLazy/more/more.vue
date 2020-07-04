<template>
  <view class="bg-white h100vh">

    <!--wx平台显示的广告-->
    <!--  #ifdef MP-WEIXIN -->
    <!--<ad class="bg-white mb-5px" unit-id="adunit-38235e0fb0498f67" ad-type="grid" grid-opacity="0.8" grid-count="5"
        ad-theme="white"></ad>
    <ad class="bg-white mb-5px" unit-id="adunit-ffa7bc1c73c7d46a"></ad>-->
    <ad class="bg-white mb-5px" unit-id="adunit-c87d18bf0f2d9df1" ad-type="video" ad-theme="white"></ad>
    <!--  #endif -->
    <!--qq平台显示的广告-->
    <!--  #ifdef MP-QQ -->
    <ad class="bg-white" unit-id="72d8cb09a1bae9fa30d9e03e7cb8a25d" type="feeds"></ad>
    <ad class="bg-white mb-5px" unit-id="bcc21923107071ac3f8aa076c7e00229" type="card"></ad>
    <ad class="bg-white" unit-id="b10fe0e7c39b9ca9e7ce19660f6d0761"></ad>
    <view class="article-row row-center">
      <button class="w100r cu-btn bg-green radius lg" @click="openVideoAd">视频广告</button>
    </view>
    <view class="article-row pt-0 pb-20px">
      <button class="w100r cu-btn bg-red light radius lg" @click="openAd">其他广告</button>
    </view>
    <!--  #endif -->

    <!--<view class="cu-bar btn-group py-10px">
        <button class="cu-btn bg-cyan light radius lg" @click="openAd">其他广告</button>
        <button class="cu-btn bg-green radius lg" @click="openVideoAd">视频广告</button>
    </view>-->

  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UniUtils from '@/utils/UniUtils'
import QQUtils from '@/utils/QQUtils'

  @Component
export default class MorePage extends Vue {
    interstitialAd: any = null
    videoAd: any = null

    onLoad () {
      // qq平台广告
      // #ifdef MP-QQ
      this.videoAd = QQUtils.createRewardedVideoAd()
      this.interstitialAd = QQUtils.createInterstitialAd()
      this.interstitialAd.load()
      this.videoAd.load()
      /* 建议放在onReady里执行，提前加载广告 */
      this.interstitialAd.onLoad()
      this.videoAd.onError((err) => {
        UniUtils.hint(err.errMsg)
      })
      this.interstitialAd.onError((err) => {
        UniUtils.hint(err.errMsg)
      })
      // #endif
    }

    openAd () {
      /* 建议放在需要展示插屏广告的时机执行 */
      this.interstitialAd.show().catch((err) => {
        UniUtils.hint(err.errMsg)
      })
    }

    openVideoAd () {
      this.videoAd.show().catch((err) => {
        UniUtils.hint(err.errMsg)
      })
    }
}
</script>
