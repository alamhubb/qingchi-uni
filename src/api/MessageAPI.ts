import http from '@/plugins/http'
import MessageAddVO from '@/model/message/MessageAddVO'
import MessageQueryVO from '@/model/message/MessageQueryVO'
import MsgDelete from '@/model/message/MsgDeleteVO'
import MessageVO from '@/model/message/MessageVO'

export default class MessageAPI {
  static sendMsgAPI<T> (chatId: number, content: string) {
    const msgAdd: MessageAddVO = new MessageAddVO(chatId, content)
    return http.post <T>('message/sendMsg', msgAdd)
  }

  static queryMessagesAPI (chatId: number, msgIds: number []) {
    return http.post<MessageVO[]>('message/queryMessages', new MessageQueryVO(chatId, msgIds))
  }

  static deleteMsgAPI (msgId: number, deleteReason: string, violation: boolean) {
    return http.post('message/deleteMsg', new MsgDelete(msgId, deleteReason, violation))
  }
}
