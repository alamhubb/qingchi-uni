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
                 :upper-threshold="upperThreshold"
                 :show-scrollbar="true"
                 :scroll-top="scrollTop"
    >
      <!--    <view class="cu-chat">-->
      <view v-if="chat.status === waitOpenStatus||chat.status === closeStatus" class="w100r h100r col-row-center">
        <view class="uni-tip  mt-80px">
          <view class="uni-tip-content text-bold">
            <template v-if="chat.needPayOpen">
              会话未开启，为避免用户被频繁恶意骚扰，只能给关注您的和给您发过消息的用户直接发送消息，给其他用户发送消息，需要支付10贝壳开启对话
            </template>
            <view v-else-if="chat.status === closeStatus" class="row-center">
              您已关闭会话，发送消息即可再次开启对话
            </view>
            <view v-else class="row-center">
              对方关注了您，发送消息即可开启对话
            </view>
          </view>

          <!--<view v-if="chat.needPayOpen" class="uni-tip-group-button">
            <button class="uni-tip-button w40r" type="default" :plain="true" @click="goBack">
              返回
            </button>
            <button class="uni-tip-button w40r" type="primary" @click="payOpenChat">
              开启对话
            </button>
          </view>-->
        </view>
      </view>
      <view v-else class="w100r row-center" :class="showMsgHint?'pt-70px':'pt-10px'">
        <view v-if="chat.loadMore === noMore || messages.length===0" class="py-xs px bg-white bd-radius mt-sm">
          会话已开启
        </view>
        <uni-load-more v-else :status="chat.loadMore"></uni-load-more>
      </view>

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
      <!--    </view>-->
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
               @confirm="sendMsgClick"
               :hold-keyboard="true"
               :confirm-hold="true"
               confirm-type="send"
        >
        <!--<view class="action" @click="showEmojiClick">
            <text class="cuIcon-emojifill text-grey"></text>
        </view>-->
        <button class="cu-btn bg-green shadow" @touchend.prevent="sendMsgClick">发送</button>
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
import {Component, Vue} from 'vue-property-decorator'
import TalkItem from '@/pages/talk/TalkItem.vue'
import ChatVO from '@/model/chat/ChatVO'
import MessageVO from '@/model/message/MessageVO'
import {namespace} from 'vuex-class'
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
import {chatModule, systemModule} from '@/plugins/store'
import UserType from '@/const/UserType'
import MsgUtil from '@/utils/MsgUtil'
import CommonStatus from '@/const/CommonStatus'
import ProviderType from '@/const/ProviderType'
import PlatformUtils from '@/utils/PlatformUtils'
import PayType from '@/const/PayType'
import CommonUtil from '@/utils/CommonUtil'
import NodesRef = UniApp.NodesRef
import SelectorQuery = UniApp.SelectorQuery
import HintMsg from '@/const/HintMsg'

const chatStore = namespace('chat')
const userStore = namespace('user')

@Component({
  components: {ReportDialog, TalkItem}
})
export default class MessageVue extends Vue {
  public $refs!: {
    reportDialog: any;
    messageMoreHandleDialog: any;
    deleteReasonDialog: any;
  }

  @chatStore.Getter('messages') readonly messages: MessageVO []
  @chatStore.Getter('chat') readonly chat: ChatVO
  @chatStore.State('scrollTop') readonly scrollTop: number
  @userStore.State('user') user: UserVO
  screenHeight: number = systemModule.screenHeight
  windowHeight: number = systemModule.windowHeight
  msgContent = ''
  inputFocus = false
  noMore: string = LoadMoreType.noMore
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
  readonly waitOpenStatus: string = CommonStatus.waitOpen
  readonly closeStatus: string = CommonStatus.close
  upperThreshold = 300

  onUnload() {
    chatModule.scrollTop = 0
  }

  openMessageMoreHandleDialog(message: MessageVO) {
    this.message = message
    this.$refs.messageMoreHandleDialog.open()
  }

  upper() {
    //只有为more才允许加载
    if (this.chat.loadMore === LoadMoreType.more) {
      // 执行正在加载动画
      this.chat.loadMore = LoadMoreType.loading
      this.queryMessages()
    }
  }

  closeShowMsgHint() {
    this.showMsgHint = false
    uni.setStorageSync(Constants.showMsgHintKey, 'false')
  }

  banChange({detail}) {
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

  inputFocusEvent() {
    MsgUtil.cantPopupPromptToast()
  }

  inputBlur() {
    if (this.inputFocus) {
      this.inputFocus = false
    }
    // #ifndef MP-WEIXIN
    // #endif
    /*
    this.showEmoji = false */
  }

  sendMsgClick() {
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
    const msgContent = this.msgContent || (this.chat.needPayOpen ? HintMsg.payOpenDefaultMsg : '')
    if (msgContent) {
      // 点击发送后立即push
      if (this.user && this.user.phoneNum) {
        //启用状态可以直接发送
        if (this.chat.status === CommonStatus.enable) {
          this.sendMsg(msgContent)
        } else {
          this.openChatPromise(msgContent).finally(() => {
            this.isOpeningChatDisableBtn = false
          })
        }
      } else {
        BalaBala.unBindPhoneNum()
      }
    } else {
      UniUtil.toast('不能发送空白内容')
    }
  }

  sendMsg(content) {
    const msg: MessageVO = new MessageVO(this.user, content)
    this.msgContent = ''
    chatModule.pushMessageAction(msg)
  }

  confirmDeleteTalk(msg: MessageVO) {
    if (this.user.userType === UserType.systemUser) {
      this.deleteMsgAction(this.curMsg)
    } else {
      UniUtil.action('是否确定删除此条消息，此操作无法恢复').then(() => {
        this.deleteMsgAction(msg)
      })
    }
    this.closeDeleteDialog()
  }

  deleteMsgAction(msg: MessageVO) {
    chatModule.deleteMsgAction(msg.id)
    MessageAPI.deleteMsgAPI(msg.id, this.deleteReason, this.violation)
  }

  openDeleteDialog() {
    this.$refs.deleteReasonDialog.open()
  }

  closeDeleteDialog() {
    this.$refs.deleteReasonDialog.close()
    this.initData()
  }

  initData() {
    this.curMsg = null
    this.deleteReason = ''
  }

  toUserDetailVue(userId: number) {
    PageUtil.navigateTo(PagePath.userDetail + '?userId=' + userId)
  }

  toVipVue() {
    PageUtil.toVipPage()
  }

  get showLoadMore() {
    /**
     * 这里有坑，如果使用加载更多，则加载更多msg后滚动会出现问题，滚动不到之前的那条，待修复的问题
     */
    return this.chat.loadMore !== LoadMoreType.more
  }

  get msgIds() {
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

  queryMessages() {
    MessageAPI.queryMessagesAPI(this.chat.id, this.msgIds).then((res) => {
      const resMessages: MessageVO[] = res.data
      //获取拼接消息之前，顶部消息的位置
      const preFirstMsgId: string = '#m' + this.messages[0].id
      const query: SelectorQuery = uni.createSelectorQuery().in(this)
      // const nodeBox: NodesRef = query.select('.scrollView')
      const nodeBox: NodesRef = query.select(preFirstMsgId)
      nodeBox.boundingClientRect((preNodeRes) => {
        const preTop = preNodeRes.top
        // this.topId = lastFirstMsgId
        // 如果还有大于等于30个就还可以加载
        if (resMessages && resMessages.length >= this.lazyLoadNum) {
          this.chat.loadMore = LoadMoreType.more
        } else {
          // 否则没有了
          this.chat.loadMore = LoadMoreType.noMore
        }
        if (resMessages.length) {
          this.messages.unshift(...resMessages)
          //获取添加后的之前顶部位置，然后滚动到此位置
          this.$nextTick(() => {
            const query: SelectorQuery = uni.createSelectorQuery().in(this)
            // const nodeBox: NodesRef = query.select('.scrollView')
            const nodeBox: NodesRef = query.select(preFirstMsgId)
            nodeBox.boundingClientRect((lastNodeRes) => {
              chatModule.scrollTop = lastNodeRes.top - preTop
            }).exec()
          })
        }
      }).exec()
      /*setTimeout(() => {
              const query: SelectorQuery = uni.createSelectorQuery().in(this)
              // const nodeBox: NodesRef = query.select('.scrollView')
              const nodeBox: NodesRef = query.select(preFirstMsgId)
              nodeBox.boundingClientRect((lastNodeRes) => {
                if (res) {
                  console.log(lastNodeRes)
                  console.log(preTop)
                  chatModule.scrollTop = lastNodeRes.top - preTop
                  console.log(chatModule.scrollTop)
                }
              }).exec()
              // this.topId = lastFirstMsgId
              // 如果还有大于等于30个就还可以加载
              if (res.data && res.data.length >= this.lazyLoadNum) {
                this.chat.loadMore = LoadMoreType.more
              } else {
                // 否则没有了
                this.chat.loadMore = LoadMoreType.noMore
              }
            }, 100)*/
    })
  }

  copyText() {
    UniUtil.textCopy(this.message.content)
    this.closeMessageMoreDialog()
    this.initChooseCommentData()
  }

  closeMessageMoreDialog() {
    this.$refs.messageMoreHandleDialog.close()
  }

  initChooseCommentData() {
    this.message = null
  }

  openReportDialog() {
    this.closeMessageMoreDialog()
    this.$refs.reportDialog.openReport()
  }

  //正在开启Chat
  isOpeningChatDisableBtn = false

  //1，如果为关闭，则显示发起开启，和待开启一样，只要状态不为代开起，就没有pay
  //2.如果为代开起，付费，则需要点击开启，或者发送时提示是否要给对方发送并开启会话
  //3. 如果为被关闭，则不显示，发送消息报错
  // 先判断消息，然后那些状态那里无所谓，取消了也无所谓，就是消息不发送
  //刚触发点击开启的方法
  async openChatPromise(content) {
    if (!this.isOpeningChatDisableBtn) {
      this.isOpeningChatDisableBtn = true
      try {
        //需要付费
        if (this.chat.needPayOpen) {
          const userShell = this.user.shell
          //不需要充值提示
          if (userShell >= 10) {
            await this.openChatAndPrompt('会话未开启，是否消耗10个贝壳开启与 ' + this.chat.nickname + ' 的对话，并给对方发送消息：' + content, content)
            //需要充值提示
          } else {
            await UniUtil.action('会话未开启，您没有贝壳了，是否直接使用现金支付开启开启与 ' + this.chat.nickname + ' 的对话，并给对方发送消息：' + content, content)
            const provider = systemModule.isApp ? ProviderType.wx : systemModule.provider
            try {
              await PlatformUtils.pay(provider, PayType.shell, 1)
            } catch (e) {
              MsgUtil.notPay()
            }
            //校验了有用户后清空消息
            this.msgContent = ''
            await chatModule.openChatAction(content)
          }
          //不需要付费
        } else {
          await this.openChatAndPrompt('是否确认开启与 ' + this.chat.nickname + ' 的对话，并给对方发送消息：' + content, content)
        }
        return
      } catch (e) {
        throw Error(e)
      }
    } else {
      await UniUtil.toast('会话开启中，请稍等')
    }
    throw Error()
  }

  //只有待开启，需付费，才会触发此方法
  payOpenChat() {
    MsgUtil.notPay()
    /*this.openChatPromise(this.msgContent || HintMsg.payOpenDefaultMsg).finally(() => {
      this.isOpeningChatDisableBtn = false
    })*/
  }

  //校验已通过，最后一个确认， 是否确认开启
  openChatAndPrompt(hintMsg: string, content: string) {
    return UniUtil.action(hintMsg).then(() => {
      //校验了有用户后清空消息
      this.msgContent = ''
      return chatModule.openChatAction(content)
    })
  }

  //开启聊天支付
  shellPayForUserContact() {

  }

  goBack() {
    PageUtil.goBack()
  }
}
</script>
