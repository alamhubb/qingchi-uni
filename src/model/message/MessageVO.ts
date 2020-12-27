import UserVO from '@/model/user/UserVO'
import CommonStatus from '@/const/CommonStatus'
import MessageType from '@/const/MessageType'
import MessageContentType from '@/const/MessageContentType'
import UniUtil from '@/utils/UniUtil'

export default class MessageVO {
  public id: number
  public user: UserVO
  public readNum: number
  public content: string
  public createTime: number
  public readStatus: string
  public type: string
  public contentType: string
  public isMine: boolean
  public isRead: boolean

  constructor (user: UserVO, content: string) {
    this.id = Math.random()
    this.user = user
    this.readNum = 0
    this.content = content
    this.readStatus = CommonStatus.sending
    this.isMine = true
    this.isRead = true
    this.createTime = new Date().getTime()
    this.type = MessageType.simple
    this.contentType = MessageContentType.text
  }
}
