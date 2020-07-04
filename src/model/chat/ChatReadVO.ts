export default class ChatReadVO {
    public chatId: number
    public messageIds: number[]

    constructor (chatId: number, messageIds: number[]) {
      this.chatId = chatId
      this.messageIds = messageIds
    }
}
