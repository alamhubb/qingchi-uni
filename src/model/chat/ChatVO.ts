import MessageVO from '@/model/message/MessageVO'

export default class ChatVO {
  public id: number
  public nickname: string
  public type: string
  public messages: MessageVO[]
  public avatar: string
  public unreadNum: number
  public updateTime: Date
  public topLevel: number
  public topFlag: boolean
  public lastContent: string
  public vipFlag: boolean

  constructor (chat: ChatVO) {
    this.id = chat.id
    this.nickname = chat.nickname
    this.type = chat.type
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
