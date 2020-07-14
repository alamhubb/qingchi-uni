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
import UniUtil from '@/utils/UniUtil'
import ConfigMap from '@/const/ConfigMap'
import PlatformUtils from '@/utils/PlatformUtils'
import { systemModule } from '@/plugins/store'
import PayType from '@/const/PayType'

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
      UniUtil.hint('您已开通会员，无需重复开通')
    } else {
      PlatformUtils.userPay(systemModule.provider, PayType.vip)
    }
  }
}
</script>
