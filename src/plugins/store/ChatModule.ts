import { VuexModule, Module, Action } from 'vuex-class-modules'
import ResultVO from '@/model/ResultVO'
import UserStore from '@/plugins/store/UserStore'
import ChatVO from '@/model/chat/ChatVO'
import MessageVO from '@/model/message/MessageVO'
import ChatType from '@/const/ChatType'
import ChatAPI from '@/api/ChatAPI'
import PageUtil from '@/utils/PageUtil'
import PagePath from '@/const/PagePath'
import MessageAPI from '@/api/MessageAPI'
import UniUtil from '@/utils/UniUtil'
import ScrollUtil from '@/utils/ScrollUtil'
import PlatformUtils from '@/utils/PlatformUtils'

@Module({ generateMutationSetters: true })
export default class ChatModule extends VuexModule {
  chat: ChatVO = null
  chats: ChatVO[] = []
  messages: MessageVO[] = []
  scrollTop: number = ScrollUtil.pageBottom
  chatsUnreadNumTotal = 0

  // 三个地方使用，初始查询，推送消息，阅读清空消息
  @Action
  computedChatsUnreadNumTotalAction () {
    // 应该在这里计算是否显示红点
    this.chatsUnreadNumTotal = this.chats.reduce((total, chat) => {
      total = total + chat.unreadNum
      return total
    }, 0)

    const chatUnreadNum: number = this.chatsUnreadNumTotal
    // 如果未读数量为0了，则隐藏红点
    if (chatUnreadNum) {
      uni.showTabBarRedDot({
        index: 2
      })
    } else {
      uni.hideTabBarRedDot({
        index: 2
      })
    }
  }

  @Action
  pushChatAction (newChat: ChatVO) {
    this.chats.unshift(newChat)
  }

  @Action
  scrollToBottomAction () {
    UniUtil.delayTime(100).then(() => {
      this.scrollTop = this.messages.length * 500
    })
  }

  @Action
  setMessagesAction (messages: MessageVO[]) {
    this.messages = messages
    this.scrollToBottomAction()
  }

  // 本地添加msg
  @Action
  pushMessageAction ({ chatId, msg }) {
    this.messages.push(msg)
    this.scrollToBottomAction()
    const index: number = this.messages.length - 1
    const chat: ChatVO = this.chat
    chat.updateTime = new Date()
    chat.lastContent = msg.content
    // 滚屏到最后面
    // 不能监控变化滚动，有时候是往前面插入
    MessageAPI.sendMsgAPI(chatId, msg.content).then((res: any) => {
      // 后台返回后再替换
      chat.updateTime = res.data.createTime
      this.replaceMessageAction({ index: index, message: res.data })
    }).catch(() => {
      // 这里应该变为发送失败
    })
    PlatformUtils.requestSubscribeChat()
  }

  @Action
  replaceMessageAction ({ index, message }) {
    this.messages.splice(index, 1, message)
  }

  @Action
  pushMessagesAction (msgs: MessageVO[]) {
    this.messages.push(...msgs)
    this.scrollToBottomAction()
  }

  @Action
  deleteMsgAction (msgId: number) {
    this.messages.splice(this.messages.findIndex(msg => msg.id === msgId), 1)
  }

  @Action
  deleteChatAction (chatId: number) {
    this.chats.splice(this.chats.findIndex(chat => chat.id === chatId), 1)
  }

  @Action
  setChatAction (chat: ChatVO) {
    this.readChatAction(chat)
    this.chat = chat
    this.setMessagesAction(chat.messages)
  }

  // 前台和后台都将chat和msg改为已读
  @Action
  readChatAction (chat: ChatVO) {
    // 不为自己的 且未读的
    const messages: MessageVO[] = chat.messages.filter(item => !item.isMine && !item.isRead)
    let msgIds: number[]
    if (messages.length > 0) {
      msgIds = messages.map(msg => msg.id)
      // 如果登录了
      if (UserStore.hasUser() && chat.type !== ChatType.system_group) {
        ChatAPI.readChat(chat.id, msgIds)
      }
      for (const message of messages) {
        message.isRead = true
      }
      chat.unreadNum = 0
      this.computedChatsUnreadNumTotalAction()
    }
  }

  @Action
  getChatsAction () {
    return ChatAPI.getChatsAPI().then((res: ResultVO<ChatVO[]>) => {
      this.setChatsAction(res.data)
    })
  }

  @Action
  setChatsAction (chats: ChatVO[]) {
    this.chats = chats
    this.computedChatsUnreadNumTotalAction()
  }

  @Action
  pushChatAndMessagesAction (newChat: ChatVO) {
    const storeChat = this.chat
    let chat: ChatVO
    // 如果正在这个chat聊天
    if (PageUtil.getCurrentPageURI() === PagePath.message && storeChat && storeChat.id === newChat.id) {
      chat = storeChat
      // 则直接往msg增加消息
      // 前台将消息改为已读
      const messages: MessageVO[] = newChat.messages
      for (const message of messages) {
        message.isRead = true
      }
      this.pushMessagesAction(messages)
      // 后台改为已读
      ChatAPI.readChat(chat.id, messages.map(item => item.id))
      // 向后台发送消息，将收到的消息改为已读
      // 如果当前就是这个聊天
    } else {
      // 不是正在这个chat聊天，但是chats列表中包含这个chat
      // 如果列表中已经包含次chat
      // 则找到chat，赋值,加入新message
      // 在列表中将这个chat放到最前面
      const storeChats = this.chats
      // 找到需要添加内容的chat
      chat = storeChats.find((chatItem: ChatVO) => chatItem.id === newChat.id)
      if (chat) {
        // 如果已经存在和此人的聊天记录了
        chat.messages.push(...newChat.messages)
        // 如果已登录
        if (UserStore.hasUser() && chat.type !== ChatType.system_group) {
          chat.unreadNum = newChat.unreadNum
        } else {
          chat.unreadNum = chat.unreadNum + 1
        }
      }
    }
    if (chat) {
      // 其他内容也要干，对方换了头像啥的应该可以看出来才行
      chat.lastContent = newChat.lastContent
      chat.updateTime = newChat.updateTime
      chat.avatar = newChat.avatar
      chat.nickname = newChat.nickname
      chat.vipFlag = newChat.vipFlag
    } else {
      this.pushChatAction(newChat)
    }
    this.computedChatsUnreadNumTotalAction()
  }
}
