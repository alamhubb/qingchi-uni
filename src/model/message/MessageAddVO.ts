export default class MessageAddVO {
    public chatId: number
    public receiveUserId: number
    public content: string

    constructor (chatId: number, receiveUserId: number, content: string) {
      this.chatId = chatId
      this.receiveUserId = receiveUserId
      this.content = content
    }
}
