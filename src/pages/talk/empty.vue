<template>
  <view class="flex-col h100r bg-default">
    <view class="q-box-row row-between-center bg-active">
      <view class="row-col-center">
        <text class="text-lgg text-orange">展示中</text>
      </view>
      <u-switch v-model="jieshou" active-color="#00C853"></u-switch>
    </view>
    <view class="q-box-row row-between-center bg-active">
      <view class="row-col-center">
        <text class="text-lgg text-orange">他人向您发起消息，需要支付贝壳数量</text>
      </view>
      <view>
        5贝壳
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import {
  Vue,
  Component
} from 'vue-property-decorator'
import TalkSwipers from '@/pages/talk/talkSwipers.vue'


@Component({
  components: {
    TalkSwipers
  }
})

//有一个表记录好有关系，然后非好友记录，你还能向对方发送几条消息。，如果对方向你发送一条，你就可以回复一条。如果对方不回复。则不能说话。超过5条以后，就是对方回一条你能回一条。
//如果对方只能主动发起，如果对方关注了你，则这个人可以给你发送消息。

//如果你被对方拉黑，每次解除好友，或者取消关注，重置次数
//如果你是他的好友
//如果你在他的关注列表
//如果你还有说话次说
//如果你主动发起说话次数小于2次，提示，您可以支付多少元，发送消息。

//点击消息按钮，

//如果你被对方拉黑，每次解除好友，或者取消关注，重置次数
//如果你是他的好友
//发送时也提示一下
//如果你在他的关注列表
//如果你还有说话次说
//如果你主动发起说话次数小于2次，提示，您可以支付多少元，发送消息。

//如果没有chat，创建chat

//进入页面时判断，是否可以发送，还是消费发送
//点击发消息按钮，mock chat，通知后台，创建chat，返回chat，更新chat。
//告知，你不是对方的好友，付费5贝壳可向对方发送3条消息


export default class EmptyVue extends Vue {
  jieshou = false
}
</script>
