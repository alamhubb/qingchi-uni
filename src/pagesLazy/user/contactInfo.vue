<template>
  <view class="bg-white">


    <q-row>
      <view class="row-col-center">
        <q-icon class="text-green" size="50" icon="mdi-bitcoin"/>
        <text class="ml-xs text-lg text-bold">
          贝壳余额：
        </text>
      </view>
      <text class="row-col-center text-lg text-bold">
        50
      </text>
    </q-row>
    <q-row>
      <text class="text-lg text-bold">
        充值：
      </text>
    </q-row>
    <view class="px">
      <u-subsection :list="payValues" :current="0" @change="switchAmount"></u-subsection>
      <view class="pt-sm">
        <view class="text-lg" @click="toShellInfo">
          提示：1元 = 10贝壳，并赠送与贝壳数量同等的等级积分。详细介绍请点 -
          <q-icon class="text-gray" icon="arrow-right" size="32"></q-icon>
          <text class="text-bold">贝壳介绍</text>
        </view>
      </view>
      <button class="bg-green-light text-white text-lg bd-none mt bg-active round" @click="userPay">
        充值
      </button>
    </view>
    <q-row>
      <view class="w100r flex-col">
        <view class="text-xl text-bold">
          历史充值和消费记录：
        </view>
        <view class="pt-xs">
          <view v-if="shellOrders.length"></view>
          <view v-else class="text-lg text-gray row-center">暂无</view>
        </view>
      </view>
    </q-row>
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

@Component({
  components: { QCol, QRowItem, QRow, FollowItem }
})
export default class ShellVue extends Vue {
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
