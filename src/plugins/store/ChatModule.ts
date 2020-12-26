import { VuexModule, Module, Action } from 'vuex-class-modules'
import ResultVO from '@/model/ResultVO'
import UserStore from '@/plugins/store/UserStore'
import ChatVO from '@/model/chat/ChatVO'
import MessageVO from '@/model/message/MessageVO'
import ChatType from '@/const/ChatType'
import ChatAPI from '@/api/ChatAPI'
import PageUtil from '@/utils/PageUtil'
import MessageAPI from '@/api/MessageAPI'
import UniUtil from '@/utils/UniUtil'
import ScrollUtil from '@/utils/ScrollUtil'
import PlatformUtils from '@/utils/PlatformUtils'
import UserVO from '@/model/user/UserVO'
import { chatModule } from '@/plugins/store/index'
import JsonUtils from '@/utils/JsonUtils'

@Module({ generateMutationSetters: true })
export default class ChatModule extends VuexModule {
  chatId: number = null
  queryChats: ChatVO[] = []
  scrollTop: number = ScrollUtil.pageBottom
  chatsUnreadNumTotal = 0

  get chats (): ChatVO[] {
    //a和b比较，返回结果1，则倒序，后者在前面
    return this.queryChats.sort((chat, chatAfter) => {
      //如果置顶优先级比较高，则排前面
      if (chatAfter.topLevel > chat.topLevel) {
        return 1
      } else if (chatAfter.topFlag != chatAfter.topFlag) {
        //是否置顶，如果一个置顶，一个不置顶，则置顶的排前面
        if (chatAfter.topFlag) {
          return 1
        } else {
          return -1
        }
      } else {
        //对比时间
        if (chatAfter.updateTime > chatAfter.updateTime) {
          return 1
        } else {
          return -1
        }
      }
    })
  }

  get chat (): ChatVO {
    return this.queryChats[0]
  }

  get messages (): MessageVO[] {
    if (this.chat.messages.length) {
      // JsonUtils.log(this.chat)
    }
    return this.chat.messages
  }

  //从列表中进入，从个人详情页进入

  //从详情进入，查看列表中是否有与此人的chat？如何查看，
  //列表中进入，需要调用后台，更新时间。

  //从列表中进入
  setChatIdToMessagePage (chatId: number) {
    this.setChatId(chatId)
    this.readChatAction(this.chat)
    this.scrollToMessagePageBottom()
    PageUtil.toMessagePage()
  }

  setChatId (chatId: number) {
    this.chatId = chatId
  }

  @Action
  userDetailToMessagePage (userChat: ChatVO) {
    //第一步，先看列表中是否已有与此用户的聊天列表
    const chat = this.queryChats.find(item => item.id === userChat.id)
    //如果已有,则直接跳转过去
    if (!chat) {
      //首先查询是否有名字相同的chat
      //这样则需要chat名称不能相同，
      //创建mock chat
      // chat = ChatVO.creatChat(user)
      this.queryChats.unshift(userChat)
      /*//修改当前chat的id
      this.setChatId(chat.id)
      //后台创建真实chat
      ChatAPI.getChatAPI(user).then(res => {
        const resultChat: ChatVO = res.data
        //修改mock chatId
        chat.id = resultChat.id
        //修改当前chat的id
        this.setChatId(resultChat.id)
        //替换当前chat
        this.replaceChat(resultChat)
      })*/
    }
    this.setChatIdToMessagePage(userChat.id)
  }

  @Action
  openChatAction () {
    return ChatAPI.openChat(this.chat.id, this.chat.needPayOpen).then((res) => {
      chatModule.replaceChat(res.data)
    })
  }

  replaceChat (chat: ChatVO) {
    this.queryChats.splice(0, 1, chat)
    this.scrollToMessagePageBottom()
  }


  // 三个地方使用，初始查询，推送消息，阅读清空消息
  @Action
  computedChatsUnreadNumTotalAction () {
    // 应该在这里计算是否显示红点
    this.chatsUnreadNumTotal = this.queryChats.reduce((total, chat) => {
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


  scrollToMessagePageBottom () {
    UniUtil.delayTime(1000).then(() => {
      this.scrollTop = this.messages.length * 500
    })
    // ScrollUtil.scrollTo(this.messages.length * 500)
  }


  //后台推送了一条消息，你不知道前台是否有这条消息，后台更不可能知道前台是否删除了这条消息
  //就直接push进去就行了。然后方法内部判断，是否有，有的话替换，msg push，没有的话直接unshift
  //有三种可能
  //一，在展示当前chat，2没在，但是列表中有，3列表中没有
  //如果是正在聊的，需要改为，已读，先不做已读未读
  @Action
  pushChatAndMessagesAction (newChat: ChatVO) {
    // console.log('出发了pushchat')
    // 如果正在这个chat聊天
    // if (PageUtil.getCurrentPageURI() === PagePath.message && this.chatId === newChat.id) {
    if (this.chatId === newChat.id) {
      // 则直接往msg增加消息
      // 前台将消息改为已读
      for (const message of newChat.messages) {
        message.isRead = true
      }
      //将新消息放到当前msg中
      this.messages.push(...newChat.messages)
      newChat.messages = this.messages
      this.replaceChat(newChat)
      // 后台改为已读
      ChatAPI.readChat(newChat.id, newChat.messages.map(item => item.id))
      // 向后台发送消息，将收到的消息改为已读
      // 如果当前就是这个聊天
    } else {
      const newChatIndex = this.queryChats.findIndex(item => item.id === newChat.id)
      if (newChatIndex > -1) {
        this.queryChats.splice(newChatIndex, 1, newChat)
      } else {
        this.queryChats.unshift(newChat)
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
  pushMessageAction (msg: MessageVO) {
    this.messages.push(msg)
    // console.log(JSON.stringify(msg))
    this.scrollToMessagePageBottom()
    const index: number = this.messages.length - 1
    // console.log(index)
    this.chat.updateTime = new Date()
    this.chat.lastContent = msg.content
    // 滚屏到最后面
    // 不能监控变化滚动，有时候是往前面插入
    MessageAPI.sendMsgAPI(this.chat.id, msg.content).then((res: any) => {
      // console.log(JSON.stringify(msg))
      // console.log(JSON.stringify(this.chat))
    })
    // 后台返回后再替换
    // chat.updateTime = res.data.createTime
    // console.log(this.messages.length)
    // this.messages.splice(index, 1)
    // console.log(this.messages.length)
    /*.catch(() => {
      // 这里应该变为发送失败
    })*/
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
      this.setChats(res.data)
    })
  }

  setChats (chats: ChatVO[]) {
    this.queryChats = chats
    this.computedChatsUnreadNumTotalAction()
  }


  //前台删除，需要增加后台删除逻辑
  @Action
  deleteMsgAction (msgId: number) {
    this.messages.splice(this.messages.findIndex(msg => msg.id === msgId), 1)
  }

  @Action
  deleteChatAction (chatId: number) {
    this.queryChats.splice(this.queryChats.findIndex(chat => chat.id === chatId), 1)
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

