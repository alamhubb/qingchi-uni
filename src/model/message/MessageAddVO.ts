export default class MessageAddVO {
  public chatId: number
  public content: string

  constructor (chatId: number, content: string) {
    this.chatId = chatId
    this.content = content
  }
}
