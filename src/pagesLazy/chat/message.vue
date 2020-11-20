<template>
  <view class="pb-100rpx h100r bg-default">
    <view v-if="showMsgHint" class="fixed-105 row-col-center bg-orange">
      <view class="flex-auto card-text-row">
        长按消息可进行举报，欢迎大家积极举报不良内容获取正义值
      </view>
      <view class="flex-none mr-10px">
        <q-icon icon="close-circle-fill" size="36" @click="closeShowMsgHint"></q-icon>
      </view>
    </view>
    <scroll-view scroll-y="true" class="cu-chat h100r"
                 @scrolltoupper="upper"
                 :show-scrollbar="true"
                 :scroll-into-view='topId'
                 :scroll-top="scrollTop"
    >
      <view v-for="msg in messages" :id="'m'+msg.id" :key="msg.id"
            :class="[msg.type === systemMsgType?'row-center':'cu-item',msg.isMine?'self':'']">
        <block v-if="msg.type === systemMsgType">
          <view class="cu-info round">
            {{ msg.content }}
          </view>
        </block>
        <block v-else-if="msg.isMine">
          <view class="flex-col w100r">
            <view class="mr-30rpx h44rpx row-end-center">
              <text class="text-sm" :class="[msg.user.vipFlag?'text-red':'text-gray']"
                    @click="toUserDetailVue(msg.user.id)">
                {{ msg.user.nickname }}
              </text>
              <image v-if="msg.user.vipFlag" class="ml-6rpx mr-6rpx size30rpx mt-n10rpx"
                     src="/static/img/crown.png"
                     @click="toVipVue"></image>
            </view>
            <view class="row-end">
              <view class="main">
                <view class="content bg-white" @longpress="openMessageMoreHandleDialog(msg)">
                  <text>{{ msg.content }}</text>
                </view>
              </view>
            </view>
          </view>
          <image class="cu-avatar radius"
                 :src="msg.user.avatar"
                 @click="toUserDetailVue(msg.user.id)"
          />
          <view class="date">{{ msg.createTime | formatTime }}</view>
        </block>
        <block v-else>
          <image class="cu-avatar radius"
                 :src="msg.user.avatar"
                 @click="toUserDetailVue(msg.user.id)"
          />
          <view class="flex-col w100r">
            <view class="ml-40rpx h44rpx row-col-center">
              <text class="text-sm" :class="[msg.user.vipFlag?'text-red':'text-gray']"
                    @click="toUserDetailVue(msg.user.id)">
                {{ msg.user.nickname }}
              </text>
              <image v-if="msg.user.vipFlag" class="ml-6rpx size30rpx mt-n10rpx"
                     src="/static/img/crown.png"
                     @click="toVipVue"></image>
            </view>
            <view class="main">
              <view class="content bg-white" @longpress="openMessageMoreHandleDialog(msg)">
                <text>{{ msg.content }}</text>
              </view>
            </view>
          </view>
          <view class="date">{{ msg.createTime | formatTime }}</view>
        </block>
      </view>
    </scroll-view>

    <view class="fixed-footer">
      <view class="cu-bar footer input">
        <!--<view class="action">
            <text class="cuIcon-sound text-grey"></text>
        </view>-->
        <!--                @focus="inputFocusEvent"-->
        <input class="solid-bottom"
               v-model.trim="msgContent"
               maxlength="300"
               :cursor-spacing="8"
               :focus="inputFocus"
               @blur="inputBlur"
               @focus="inputFocusEvent"
               @confirm="sendMsg"
               :hold-keyboard="true"
               :confirm-hold="true"
               confirm-type="send"
        >
        <!--<view class="action" @click="showEmojiClick">
            <text class="cuIcon-emojifill text-grey"></text>
        </view>-->
        <button class="cu-btn bg-green shadow" @touchend.prevent="sendMsg">发送</button>
      </view>
      <!--      <view v-show="showEmoji" class="w100vw bg-blue" :style="{height:keyboardHeight+'px'}"></view>-->
    </view>

    <uni-popup ref="deleteReasonDialog" :show="false" :custom="true" :mask-click="false">
      <view class="uni-tip">
        <view class="uni-tip-title">删除原因</view>
        <view class="uni-textarea bd-1 bd-radius">
          <textarea placeholder="*必填，删除原因" v-model="deleteReason"
                    :show-confirm-bar="false"
          />
        </view>
        <view class="uni-common-mt">
          是否封禁:
          <switch class="ml-5px" @change="banChange"/>
        </view>
        <view class="uni-tip-group-button">
          <button class="uni-tip-button w40r" type="default" @click="closeDeleteDialog" :plain="true">取消
          </button>
          <button class="uni-tip-button w40r" type="primary" @click="confirmDeleteTalk"
                  :disabled="!deleteReason">确定
          </button>
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="messageMoreHandleDialog" :custom="true" :mask-click="true">
      <view class="uni-tip w180px">
        <uni-list class="w100px">
          <uni-list-item :show-arrow="true" title="复制" @click="copyText"/>
          <uni-list-item v-if="user&&message&&!message.isMine" :show-arrow="true" title="举报"
                         @click="openReportDialog"/>
        </uni-list>
      </view>
    </uni-popup>

    <!--<view v-show="showEmoji" class="emoji-model" :style="{height:emojiModelHeight+'px'}"
          @touchstart="inputBlur">
    </view>-->

    <report-dialog ref="reportDialog" :report-info="message" :report-info-type="reportContentType"></report-dialog>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TalkItem from '@/pages/talk/TalkItem.vue'
import ChatVO from '@/model/chat/ChatVO'
import MessageVO from '@/model/message/MessageVO'
import { namespace } from 'vuex-class'
import UserVO from '@/model/user/UserVO'
import LoadMoreType from '@/const/LoadMoreType'
import Constants from '@/const/Constant'
import PagePath from '@/const/PagePath'
import UniUtil from '@/utils/UniUtil'
import MessageAPI from '@/api/MessageAPI'
import ReportContentType from '@/const/ReportContentType'
import ReportDialog from '@/pagesLazy/ReportDialog.vue'
import MessageType from '@/const/MessageType'
import PageUtil from '@/utils/PageUtil'
import BalaBala from '@/utils/BalaBala'
import { chatModule, systemModule } from '@/plugins/store'
import UserType from '@/const/UserType'
import MsgUtil from '@/utils/MsgUtil'

const chatStore = namespace('chat')
const userStore = namespace('user')

@Component({
  components: { ReportDialog, TalkItem }
})
export default class MessageVue extends Vue {
  public $refs!: {
    reportDialog: any;
    messageMoreHandleDialog: any;
    deleteReasonDialog: any;
  }

  @chatStore.State('messages') readonly messages: MessageVO []
  @chatStore.State('chat') readonly chat: ChatVO
  @chatStore.State('scrollTop') readonly scrollTop: number
  @userStore.State('user') user: UserVO
  screenHeight: number = systemModule.screenHeight
  windowHeight: number = systemModule.windowHeight
  msgContent = ''
  inputFocus = false
  loadMore: string = LoadMoreType.more
  lazyLoadNum = 30
  topId = ''
  deleteReason: string = null
  // 是否封禁
  violation = false
  curMsg: MessageVO = null
  showEmoji = false
  keyboardHeight = 200
  emojiModelHeight = 300
  message: MessageVO = null
  reportContentType: string = ReportContentType.message
  systemMsgType: string = MessageType.system
  showMsgHint: boolean = uni.getStorageSync(Constants.showMsgHintKey) !== 'false'

  onUnload () {
    chatModule.scrollTop = 0
  }

  openMessageMoreHandleDialog (message: MessageVO) {
    this.message = message
    this.$refs.messageMoreHandleDialog.open()
  }

  upper () {
    if (this.loadMore !== LoadMoreType.noMore) {
      // 执行正在加载动画
      this.loadMore = LoadMoreType.loading
      this.queryMessages()
    }
  }

  closeShowMsgHint () {
    this.showMsgHint = false
    uni.setStorageSync(Constants.showMsgHintKey, 'false')
  }

  banChange ({ detail }) {
    this.violation = detail.value
  }

  /* showEmojiClick () {
    UniUtils.delayTime(100).then(() => {
      this.showEmoji = true
    })
  }

  fixedClick () {
  }
   */

  // { detail }
  /* inputFocusEvent () {
    /!* this.showEmoji = false
    const height: number = detail.height
    if (height > 60) {
      this.keyboardHeight = height - 50
    }
    // 算出来输入框的高度余量
    this.emojiModelHeight = this.windowHeight - (this.keyboardHeight + 56) *!/
    this.inputFocus = true
  } */

  inputFocusEvent () {
    MsgUtil.cantPopupPromptToast()
  }

  inputBlur () {
    if (this.inputFocus) {
      this.inputFocus = false
    }
    // #ifndef MP-WEIXIN
    // #endif
    /*
    this.showEmoji = false */
  }

  sendMsg () {
    // 微信支持 hold-keyboard
    // app和h5支持 @touchend.prevent
    // 只有qq需要特殊处理
    // #ifdef MP-QQ
    this.inputFocus = false
    // 严格测试150毫秒时间比较合适，不卡顿，且不出bug
    UniUtil.delayTime(150).then(() => {
      this.inputFocus = true
    })
    // #endif
    if (this.msgContent) {
      // 点击发送后立即push
      if (this.user && this.user.phoneNum) {
        const msg: MessageVO = new MessageVO(this.user, this.msgContent)
        this.msgContent = ''
        chatModule.pushMessageAction({ chatId: this.chat.id, msg: msg })
      } else {
        BalaBala.unBindPhoneNum()
      }
    } else {
      UniUtil.toast('不能发送空白内容')
    }
  }

  confirmDeleteTalk (msg: MessageVO) {
    if (this.user.userType === UserType.systemUser) {
      this.deleteMsgAction(this.curMsg)
    } else {
      UniUtil.action('是否确定删除此条消息，此操作无法恢复').then(() => {
        this.deleteMsgAction(msg)
      })
    }
    this.closeDeleteDialog()
  }

  deleteMsgAction (msg: MessageVO) {
    chatModule.deleteMsgAction(msg.id)
    MessageAPI.deleteMsgAPI(msg.id, this.deleteReason, this.violation)
  }

  openDeleteDialog () {
    this.$refs.deleteReasonDialog.open()
  }

  closeDeleteDialog () {
    this.$refs.deleteReasonDialog.close()
    this.initData()
  }

  initData () {
    this.curMsg = null
    this.deleteReason = ''
  }

  toUserDetailVue (userId: number) {
    PageUtil.navigateTo(PagePath.userDetail + '?userId=' + userId)
  }

  toVipVue () {
    PageUtil.toVipPage()
  }

  get showLoadMore () {
    /**
     * 这里有坑，如果使用加载更多，则加载更多msg后滚动会出现问题，滚动不到之前的那条，待修复的问题
     */
    return this.loadMore !== LoadMoreType.more
  }

  get msgIds () {
    if (this.messages.length) {
      return this.messages.map(item => {
        if (item && item.id) {
          return item.id
        } else {
          return 0
        }
      })
    }
    return [0]
  }

  queryMessages () {
    MessageAPI.queryMessagesAPI(this.msgIds).then((res: any) => {
      const lastFirstMsgId: string = 'm' + this.messages[0].id
      this.messages.unshift(...res.data)
      this.topId = lastFirstMsgId
      // 如果还有大于等于30个就还可以加载
      if (res.data && res.data.length >= this.lazyLoadNum) {
        this.loadMore = LoadMoreType.more
      } else {
        // 否则没有了
        this.loadMore = LoadMoreType.noMore
      }
    })
  }

  copyText () {
    UniUtil.textCopy(this.message.content)
    this.closeMessageMoreDialog()
    this.initChooseCommentData()
  }

  closeMessageMoreDialog () {
    this.$refs.messageMoreHandleDialog.close()
  }

  initChooseCommentData () {
    this.message = null
  }

  openReportDialog () {
    this.closeMessageMoreDialog()
    this.$refs.reportDialog.openReport()
  }
}
</script>
