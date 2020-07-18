<template>
  <view>
    <view class="article-row">
      <view class="text-xxl text-red">您当前的爱心值为：{{user.loveValue}}</view>
      <view class="text-xxl text-red">今日已获得爱心值：{{todayLoveValue}}
        <text v-if="todayLoveValue>=rewardedAdLimitLoveValue">
          ，已达到今日观看视频可获得爱心值的上限，将不再获得爱心值奖励
        </text>
      </view>
    </view>

    <view class="article">
      <view class="text-xl">1.用户每次观看视频广告
        <text class="text-red">15</text>
        秒以上可获得
        <text class="text-red">10</text>
        点爱心值奖励 ，每天最多获得
        <text class="text-red">{{rewardedAdLimitLoveValue}}</text>
        点爱心值奖励,
        即每天只能获得
        <text class="text-red">{{rewardedAdLimit}}</text>
        次奖励
      </view>
      <view class="text-xl">2.爱心值会展示在用户动态中</view>
      <view class="text-xl">3.未来爱心值将支持更多使用方式</view>
      <view class="text-xl">4.最终解释权归本公司所有</view>
    </view>
    <view class="article-row">
      <button type="primary" @click="openAd">观看视频广告</button>
    </view>

    <view class="article">
      <view class="row-center">--------------分割线--------其他说明--------------</view>
      <view class="text-xl">为什么叫爱心值？</view>
      <view class="pt-0">
        用户每次观看15s获以上视频⼴告，我们都能收到一小笔微薄的广告商提供的广告费，观看广告可以算作用户对软件的支持，对本软件的发展献出的爱心，所以此功能称为爱心值。
      </view>
      <view class="text-xl">本软件的理想</view>
      <view class="pt-0">
        本软件的理想是打造一个干净绿色年轻人热爱的交友社区，服务90%以上的年轻人，
        如果您觉得我们目前做的还可以，并期望我们能做的更好，欢迎点击观看广告按钮或者开通VIP功能，以表示您对我们的支持，献出您对我们的爱心，非常感谢您的支持与理解，比心
      </view>
      <view class="text-xl">为什么要赚钱？</view>
      <view class="pt-0">本软件目前尚未盈利，我们需要赚钱才能招聘设计人员，开发人员，购买服务器，完善软件和开发更好玩的功能，做出更好用的软件，更好的服务大家，追求理想</view>
      <view class="text-xl">联系客服</view>
      <view class="pt-0">
        有任何问题与建议都可以联系客服微博：{{wbService}}，微信或qq:491369310
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UserVO from '@/model/user/UserVO'
import { namespace } from 'vuex-class'
import LoveValueAPI from '@/api/LoveValueAPI'
import UniUtil from '@/utils/UniUtil'
import UserStore from '@/plugins/store/UserStore'
import QQUtils from '@/utils/QQUtils'
import WxUtils from '@/utils/WxUtils'
import APPUtil from '@/utils/APPUtil'
import JsonUtils from '@/utils/JsonUtils'

const appStore = namespace('app')
const userStore = namespace('user')
const configStore = namespace('config')

@Component
export default class LoveValueVue extends Vue {
  @userStore.State('user') user: UserVO
  @appStore.State('appConfig') readonly appConfig: object
  @configStore.Getter('rewardedAdLimit') readonly rewardedAdLimit: number
  @configStore.Getter('wbService') readonly wbService: string

  videoAd: any = null
  todayLoveValue = 0

  get rewardedAdLimitLoveValue (): number {
    return this.rewardedAdLimit * 10
  }

  onLoad () {
    LoveValueAPI.queryTodayLoveValueAPI().then((res: any) => {
      this.todayLoveValue = res.data
    })

    // #ifdef APP-PLUS
    this.videoAd = APPUtil.createRewardedVideoAd()
    // #endif
    // #ifdef MP-WEIXIN
    this.videoAd = WxUtils.createRewardedVideoAd()
    // #endif
    // #ifdef MP-QQ
    this.videoAd = QQUtils.createRewardedVideoAd()
    // #endif
    this.videoAd.load()
    this.videoAd.onError(err => {
      UniUtil.hint('广告加载失败，请稍候重试，' + JsonUtils.toJson(err))
    })
    this.videoAd.onClose((res: any) => {
      LoveValueAPI.watchVideoAdsAPI(res.isEnded).then((res: any) => {
        if (res.data) {
          this.todayLoveValue = res.data.todayLoveValue
          UserStore.setMineUser(res.data.user)
        }
      })
      // 关闭广告，res=true，则为成功观看，调用后台添加积分，后台提示奖励10积分，或者今天已观看满次，不再获得爱心值奖励
    })
  }

  openAd () {
    this.videoAd.show().catch((err) => {
      UniUtil.hint(err.errMsg)
    })
  }
}
</script>
