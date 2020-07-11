<template>
  <view v-show="inputContentFocus"
        class="cu-bar input fixed-footer elevation-4"
  >
    <input
        v-model.trim="content"
        :adjust-position="true"
        class="solid-bottom"
        confirm-type="send"
        :focus="inputContentFocus"
        maxlength="300"
        :cursor-spacing="8"
        :placeholder="msgInputPlaceholder"
        @blur="inputContentBlur"
    />
    <!--<view class="action">
        <text class="cuIcon-emojifill text-grey"></text>
    </view>-->
    <button class="cu-btn bg-cyan" @click="sendComment" :disabled="!content">发送</button>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import UserVO from '@/model/user/UserVO'
import UniUtil from '@/utils/UniUtil'
import { talkModule } from '@/plugins/store'
import BalaBala from '@/utils/BalaBala'
import PlatformUtils from '@/utils/PlatformUtils'

const talkStore = namespace('talk')
const userStore = namespace('user')
@Component
export default class MsgInput extends Vue {
  content = ''
  @talkStore.State('currentContent') currentContent: string
  @talkStore.State('inputContentFocus') inputContentFocus: boolean
  @userStore.State('user') user: UserVO

  get msgInputPlaceholder () {
    if (this.currentContent) {
      return '回复：' + this.currentContent
    } else {
      return ''
    }
  }

  // formid有坑，只能发送给自己openid
  sendComment () {
    // 登录才能发表评论
    if (this.user && this.user.phoneNum) {
      // 如果有值
      if (this.content) {
        talkModule.addComment({ content: this.content })
        this.content = ''
        // 申请订阅
        PlatformUtils.requestSubscribeComment()
      } else {
        UniUtil.error('不能发表内容为空的评论')
      }
    } else {
      BalaBala.unBindPhoneNum()
    }
  }

  inputContentBlur () {
    talkModule.inputContentBlur()
  }
}
</script>
