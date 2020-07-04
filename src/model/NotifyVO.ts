import UserVO from '@/model/user/UserVO'
import ChatVO from '@/model/chat/ChatVO'

export default class NotifyVO {
  public user: UserVO
  public chat: ChatVO
  public type: string
  public content: string
}
