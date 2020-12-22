export default class MessageQueryVO {
  public chatId: number
  public msgIds: number []

  constructor (chatId: number, msgIds: number[]) {
    this.chatId = chatId
    this.msgIds = msgIds
  }
}
