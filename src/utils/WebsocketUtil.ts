import TokenUtil from '@/utils/TokenUtil'
import NotifyVO from '@/model/NotifyVO'
import UniUtil from './UniUtil'
import JsonUtils from '@/utils/JsonUtils'
import { appModule, chatModule } from '@/plugins/store'
import NotifyType from '@/const/NotifyType'
import ChatVO from '@/model/chat/ChatVO'
import AppConfig from '@/const/AppConfig'

export default class WebsocketUtil {
  static websocketConnect (reload: boolean) {
    let token: string
    if (TokenUtil.hasToken()) {
      token = TokenUtil.get()
    } else {
      token = UniUtil.getUUID()
    }
    uni.connectSocket({
      url: AppConfig.websocketUrl + 'webSocket/message?token=' + token,
      /* url: CommonUtil.websocketUrl + 'webSocket/message',
      header: {
        token: token
      }, */
      complete: () => {
        console.log('完成')
      }
    })

    uni.onSocketOpen(() => {
      console.log('打开')
      if (reload) {
        console.log('重新加载')
        chatModule.getChatsAction()
      }
    })

    uni.onSocketError(() => {
      console.log('触发了错误')
      // #ifndef MP
      UniUtil.delayTime(5000).then(() => {
        WebsocketUtil.websocketConnect(true)
      })
      // #endif
    })

    uni.onSocketClose(() => {
      console.log('触发了关闭')
      UniUtil.delayTime(5000).then(() => {
        WebsocketUtil.websocketConnect(true)
      })
    })

    uni.onSocketMessage((res: any) => {
      const notify: NotifyVO = JsonUtils.jsonParse(res.data)
      // todo 直接将这个评论添加到talk中
      if (notify.type === NotifyType.comment) {
        appModule.addUnreadNotifies(notify.user)
      } else if (notify.type === NotifyType.message) {
        // 暂不支持圈子功能，推送的时候把所有未读都推送过来，还没做，匹配成功的话在talk和match页都显示匹配成功通知？，还有阅读消息后后台也要清0
        chatModule.pushChatAndMessagesAction(new ChatVO(notify.chat))
      }
    })
  }

  static websocketClose () {
    uni.closeSocket()
  }
}
