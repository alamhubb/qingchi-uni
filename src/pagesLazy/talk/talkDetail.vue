<template>
  <view class="h100vh bg-default">
    <msg-input v-if="showMsgInput">
    </msg-input>
    <u-navbar :is-back="false">
      <view class="flex-row w100r px">
        <view class="col-center bg-active" @click="goBack">
          <q-icon icon="arrow-left" size="42"></q-icon>
        </view>
        <view class="col-center bg-active ml-lg" @click="goHome">
          <q-icon icon="home" size="46"></q-icon>
        </view>
        <view class="ml-lg text-bold text-lg">
          动态详情
        </view>
      </view>
    </u-navbar>
    <view class="pb-155px bg-default" v-if="talk">
      <talk-item :talk="talk" showAllComment
                 @deleteTalk="deleteTalk"
      />
      <talk-operate @deleteTalk="deleteTalk"></talk-operate>
      <!--wx平台显示的广告-->
      <!--  #ifdef MP-WEIXIN -->
      <ad class="bg-white mt-10px w100vw" unit-id="adunit-65c8911d279d228f" ad-type="video"
          ad-theme="white"></ad>
      <!--  #endif -->
      <!--qq平台显示的广告-->
      <!--  #ifdef MP-QQ -->
      <ad class="bg-white mt-10px w100vw" unit-id="bcc21923107071ac3f8aa076c7e00229" type="card"></ad>
      <!--  #endif -->

      <!--头条平台显示的广告-->
      <!--  #ifdef MP-TOUTIAO -->
      <ad class="bg-white mb-5px" type="banner video large"
          unit-id="3snract0gqnc3fn16d"></ad>
      <!--  #endif -->

      <!--  #ifdef APP-PLUS -->
      <ad class="bg-white mb-5px" adpid="1890536227"></ad>
      <!--  #endif -->
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TalkVO from '@/model/talk/TalkVO'
import TalkAPI from '@/api/TalkAPI'
import TalkItem from '@/pages/talk/TalkItem.vue'
import PageUtil from '@/utils/PageUtil'
import { namespace } from 'vuex-class'
import TalkOperate from '@/pages/talk/talkOperate.vue'

const appStore = namespace('app')

@Component({
  components: {
    TalkItem,
    TalkOperate
  }
})
export default class TalkDetail extends Vue {
  talk: TalkVO = null
  showMsgInput = false
  @appStore.State('appConfig') readonly appConfig: object

  deleteTalk () {
    PageUtil.goBack()
  }

  onLoad (params: any) {
    const talkId = params.talkId
    TalkAPI.queryTalkDetailAPI(talkId).then((res: any) => {
      this.talk = res.data
      // this.$store.commit('talk/setTalk', this.talk)
    })
  }

  goHome () {
    PageUtil.goHome()
  }

  goBack () {
    PageUtil.goBack()
  }

  onShow () {
    this.showMsgInput = true
  }

  onHide () {
    this.showMsgInput = false
  }
}
</script>
