import MessageVO from '@/model/message/MessageVO'
import UserVO from '@/model/user/UserVO'
import ChatType from '@/const/ChatType'
import CommonStatus from '@/const/CommonStatus'

export default class ChatVO {
  public id: number = null
  public nickname: string = null
  public type: string = null
  public status: string = null
  public messages: MessageVO[] = []
  public avatar: string = null
  public unreadNum: number = null
  public updateTime: Date = null
  public topLevel: number = null
  public topFlag: boolean = null
  public lastContent: string = null
  public vipFlag: boolean = null
  public needPayOpen: boolean = null
  public receiveUserId: number = null
  public loadMore: string = null

  constructor (chat?: ChatVO) {
    if (chat) {
      this.id = chat.id
      this.nickname = chat.nickname
      this.type = chat.type
      this.status = chat.status
      this.messages = chat.messages
      this.avatar = chat.avatar
      this.topLevel = chat.topLevel
      this.topFlag = chat.topFlag
      this.unreadNum = chat.unreadNum
      this.updateTime = new Date(chat.updateTime)
      this.lastContent = chat.lastContent
      this.vipFlag = chat.vipFlag
      this.receiveUserId = chat.receiveUserId
      this.loadMore = chat.loadMore
    }
  }
/*
  static creatChat (user: UserVO): ChatVO {
    const chat = new ChatVO()
    chat.receiveUserId = user.id
    chat.nickname = user.nickname
    chat.type = ChatType.single
    chat.messages = []
    chat.avatar = user.avatar
    chat.unreadNum = 0
    chat.updateTime = new Date()
    chat.lastContent = ''
    chat.vipFlag = user.vipFlag
    chat.status = CommonStatus.waitOpen
    // chat.needPayOpen = user.showBuyMsg
    return chat
  }*/
}
