import MessageVO from '@/model/message/MessageVO'
import UserVO from '@/model/user/UserVO'
import ChatType from '@/const/ChatType'
import CommonStatus from '@/const/CommonStatus'

export default class ChatVO {
  public id: number
  public nickname: string
  public type: string
  public status: string
  public messages: MessageVO[]
  public avatar: string
  public unreadNum: number
  public updateTime: Date
  public topLevel: number
  public topFlag: boolean
  public lastContent: string
  public vipFlag: boolean
  public needPayOpen: boolean

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
    }
  }

  static creatChat (user: UserVO): ChatVO {
    const chat = new ChatVO()
    chat.nickname = user.nickname
    chat.type = ChatType.single
    chat.messages = []
    chat.avatar = user.avatar
    chat.unreadNum = 0
    chat.updateTime = new Date()
    chat.lastContent = ''
    chat.vipFlag = user.vipFlag
    chat.status = CommonStatus.waitOpen
    chat.needPayOpen = user.showBuyMsg
    return chat
  }
}
