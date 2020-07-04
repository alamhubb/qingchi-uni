<template>
    <view>
        <view v-if="user.vipFlag" class="article-row">
            <view class="text-xxl text-red">您已开通VIP，VIP到期时间为：</view>
            <view class="text-xxl text-red">{{user.vipEndDate | parseStrToTime}}</view>
        </view>

        <view class="article">
            <view class="text-xl">1.vip功能：名字变红色，名字后加vip标识</view>
            <view class="text-xl">2.vip收费：{{vipPrice/100}}元一个月</view>
            <view class="text-xl">3.当前只支持开通当月vip，不支持续费</view>
            <view class="text-xl">4.每日远高于普通用户的匹配次数，普通用户5次，vip用户30次</view>
            <view class="text-xl">5.匹配功能特权，在基础颜值上额外增加10分</view>
            <view class="text-xl">6.普通用户每天只能发布5条动态，VIP用户每天可发布20条动态</view>
        </view>
        <view class="article">
            <view class="text-xl">不支持退款，请大家谨慎付款</view>
            <view class="text-xl">最终解释权归本公司所有</view>
        </view>

        <view v-if="!user.vipFlag" class="article-row">
            <button type="primary" @click="postPay">开通一个月VIP（{{vipPrice/100}}元）</button>
        </view>
    </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TalkItem from '@/pages/talk/TalkItem.vue'
import UserVO from '@/model/user/UserVO'
import TalkItemContent from '@/pages/talk/TalkItemContent.vue'
import { namespace } from 'vuex-class'
import UserEdit from '@/pages/user/UserEdit.vue'
import UserInfo from '@/pages/user/UserInfo.vue'
import PageUtil from '@/utils/PageUtil'
import PagePath from '@/const/PagePath'
import UniUtils from '@/utils/UniUtils'
import UserStore from '@/plugins/store/UserStore'
import UserAPI from '@/api/UserAPI'
import ProviderType from '@/const/ProviderType'
import ConfigMap from '@/const/ConfigMap'
import QQUtils from '@/utils/QQUtils'
import ErrorMsg from '@/const/ErrorMsg'

const userStore = namespace('user')
const configStore = namespace('config')

  @Component({
    components: { UserInfo, UserEdit, TalkItem, TalkItemContent }
  })
export default class VipVue extends Vue {
    @userStore.State('user') user: UserVO
    @configStore.Getter(ConfigMap.vipPriceKey) vipPrice: number

    postPay () {
      if (this.user.vipFlag) {
        UniUtils.hint('您已开通会员，无需重复开通')
      } else {
        // #ifndef MP
        UniUtils.hint('非小程序平台暂不支持开通VIP')
        // #endif
        // #ifdef MP
        // #ifdef MP-WEIXIN
        UserAPI.payVipAPI(ProviderType.wx).then((res: any) => {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success () {
              UserStore.getMineUserAction().then(() => {
                UniUtils.hint('开通会员成功')
                PageUtil.reLaunch(PagePath.userMine)
              })
            },
            fail () {
              UniUtils.error(ErrorMsg.vipOpenFailMsg)
            }
          })
        })
        // #endif
        // todo 应该采取后台获取ip的方式
        // #ifdef MP-QQ
        QQUtils.payVipAPI()
        // #endif
        // #endif
      }
    }
}
</script>
