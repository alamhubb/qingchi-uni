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
  chatId: number = null
  chats: ChatVO[] = []
  scrollTop: number = ScrollUtil.pageBottom
  chatsUnreadNumTotal = 0

  get chatIndex (): number {
    return this.chats.findIndex(item => item.id === this.chatId)
  }

  get chat (): ChatVO {
    return this.chats[this.chatIndex]
  }

  get messages (): MessageVO[] {
    return this.chat.messages
  }

  //从列表中进入，从个人详情页进入

  //从详情进入，查看列表中是否有与此人的chat？如何查看，
  //列表中进入，需要调用后台，更新时间。

  setChat (chatId: number, chat: ChatVO) {
    this.chatId = chatId
    const chatIndex = this.chats.findIndex(item => item.id === this.chatId)
    if (chatIndex > -1) {
      this.chats[chatIndex] = chat
    }
  }

  @Action
  setChatAction (chat: ChatVO) {
    this.readChatAction(chat)
    this.setChat
    this.setMessagesAction(chat.messages)
    this.scrollToBottomAction()
  }

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
  scrollToBottomAction () {
    UniUtil.delayTime(100).then(() => {
      this.scrollTop = this.messages.length * 500
    })
  }


  //后台推送了一条消息，你不知道前台是否有这条消息，后台更不可能知道前台是否删除了这条消息
  //就直接push进去就行了。然后方法内部判断，是否有，有的话替换，msg push，没有的话直接unshift
  //有三种可能
  //一，在展示当前chat，2没在，但是列表中有，3列表中没有
  //如果是正在聊的，需要改为，已读，先不做已读未读
  @Action
  pushChatAndMessagesAction (newChat: ChatVO) {
    let chat: ChatVO
    // 如果正在这个chat聊天
    // if (PageUtil.getCurrentPageURI() === PagePath.message && this.chatId === newChat.id) {

    if (this.chatId === newChat.id) {
      this.chats.splice(this.chatIndex, 1, newChat)
      // 则直接往msg增加消息
      // 前台将消息改为已读
      for (const message of newChat.messages) {
        message.isRead = true
      }
      this.messages.push(...newChat.messages)
      this.scrollToBottomAction()
      // 后台改为已读
      ChatAPI.readChat(newChat.id, newChat.messages.map(item => item.id))
      // 向后台发送消息，将收到的消息改为已读
      // 如果当前就是这个聊天
    } else {
      const newChatIndex = this.chats.findIndex(item => item.id === newChat.id)
      if (newChatIndex > -1) {
        this.chats.splice(newChatIndex, 1, newChat)
      }else {
        this.chats.unshift(newChat)
      }
      //不需要吧，后台chat应该计算好当前未读数量
      /*// 如果已登录
      if (UserStore.hasUser() && chat.type !== ChatType.system_group) {
        chat.unreadNum = newChat.unreadNum
      } else {
        chat.unreadNum = chat.unreadNum + 1
      }*/

      // 不是正在这个chat聊天，但是chats列表中包含这个chat
      // 如果列表中已经包含次chat
      // 则找到chat，赋值,加入新message
      // 在列表中将这个chat放到最前面
      // 找到需要添加内容的chat
    }
    //计算未读数量
    this.computedChatsUnreadNumTotalAction()
  }

  //在聊天界面的时候，自己发送msg 本地添加msg
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
      this.messages.splice(index, 1, res.data)
    }).catch(() => {
      // 这里应该变为发送失败
    })
    PlatformUtils.requestSubscribeChat()
  }


  // 前台和后台都将chat和msg改为已读,更新chat的时间
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


  //获取chats
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


  //前台删除，需要增加后台删除逻辑
  @Action
  deleteMsgAction (msgId: number) {
    this.messages.splice(this.messages.findIndex(msg => msg.id === msgId), 1)
  }

  @Action
  deleteChatAction (chatId: number) {
    this.chats.splice(this.chats.findIndex(chat => chat.id === chatId), 1)
  }
}

/*  @Action
  pushMessagesAction (msgs: MessageVO[]) {

  }*/
/*
  @Action
  pushChatAction (newChat: ChatVO) {
    this.chats.unshift(newChat)
  }*/

