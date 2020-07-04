import http from '@/plugins/http'
import ChatReadVO from '@/model/chat/ChatReadVO'
import ChatRemoveVO from '@/model/chat/ChatRemoveVO'

export default class ChatAPI {
  static getChatsAPI () {
    return http.post('chat/queryChats')
  }

  static readChat (chatId: number, messageIds: number[]) {
    const chatRead: ChatReadVO = new ChatReadVO(chatId, messageIds)
    http.post('chat/readChat', chatRead)
  }

  static removeChat (chatId: number) {
    const chat: ChatRemoveVO = new ChatRemoveVO(chatId)
    return http.post('chat/removeChat', chat)
  }
}
