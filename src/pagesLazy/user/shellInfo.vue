<template>
  <view class="bg-white px">
    <view class="text-xl text-bold mt-xl">
      优点介绍:
    </view>
    <view class="text-xl text-bold mt-sm">
      1.使用此功能处关系加好友，可提高交友质量，过滤低质量人员。
    </view>
    <view class="text-xl text-bold mt-sm">
      2. 他人通过此功能获取您的联系方式时，需要支付{{contactExpenseShell}}个贝壳，您可获得{{contactUserReceiveShell}}个贝壳奖励
    </view>
    <view class="text-xl text-bold mt-sm">
      2.他人只有具有真实想加您好友的意愿，才愿意支付10个贝壳，获取您的联系方式，此功能可帮您过滤掉其他低质量杂乱人员。
    </view>
    <view class="text-xl text-bold mt-sm">
      4. 10个贝壳等于1元人民币，如果连10个贝壳都不愿意支付的人，很有可能是乱加好友，或者其他低质量好友。
    </view>

    <view class="text-xl text-orange text-bold mt-xl">
      举例填写方式：vx:491369310
    </view>
    <view class="text-xl text-orange text-bold">
      填写后可通过展示/隐藏按钮，控制别人是否能获取您的联系方式
    </view>

    <view class="text-xl text-orange text-bold mt-lg">
      了解了此功能的优点后，快去填写联系方式，更优质的处关系吧
    </view>
    <view class="text-xl text-orange text-bold mt-lg">
      有任何疑问，客服qq或vx：491369310
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import FollowItem from '@/pagesLazy/user/FollowItem.vue'
import QRow from '@/components/q-row/q-row.vue'
import QRowItem from '@/components/q-row-item/q-row-item.vue'
import PageUtil from '@/utils/PageUtil'
import SkipUrlConst from '@/const/SkipUrlConst'
import EnumVO from '@/const/EnumVO'
import PlatformUtils from '@/utils/PlatformUtils'
import QCol from '@/components/q-col/q-col.vue'
import { namespace } from 'vuex-class'
import ConfigMap from '@/const/ConfigMap'
import UserVO from '@/model/user/UserVO'

const configStore = namespace('config')
const userStore = namespace('user')

@Component({
  components: { QCol, QRowItem, QRow, FollowItem }
})
export default class ShellInfoVue extends Vue {
  @userStore.State('user') user: UserVO

  payValues = [
    new EnumVO(1, '1元'),
    new EnumVO(5, '5元'),
    new EnumVO(30, '30元')
  ]

  currentAmount = Number(this.payValues[0].value)

  shellOrders = []

  switchAmount (index) {
    this.currentAmount = Number(this.payValues[index].value)
  }

  toShellInfo () {
    PageUtil.navigateTo(SkipUrlConst.shellInfoUrl())
  }

  userPay () {
    PlatformUtils.userPay(this.currentAmount)
  }
}
</script>
