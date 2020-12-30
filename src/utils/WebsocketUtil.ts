import TokenUtil from '@/utils/TokenUtil'
import NotifyVO from '@/model/NotifyVO'
import UniUtil from './UniUtil'
import JsonUtils from '@/utils/JsonUtils'
import { appModule, chatModule } from '@/plugins/store'
import NotifyType from '@/const/NotifyType'
import ChatVO from '@/model/chat/ChatVO'
import AppConfig from '@/const/AppConfig'

export default class WebsocketUtil {

  //失败重连时间
  static failedReconnectTime = 2000
  static timer: number

  static websocketConnect (reload: boolean) {
    let token: string

    if (TokenUtil.hasToken()) {
      token = TokenUtil.get()
    } else {
      token = UniUtil.getUUID()
    }
    uni.connectSocket({
      //因为app不支持header中传参
      // url: AppConfig.websocketUrl + 'imserver/' + token,
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

      if (reload || WebsocketUtil.timer) {
        clearInterval(WebsocketUtil.timer)
      }

      if (reload) {
        console.log('重新加载')
        chatModule.getChatsAction()
      }
      //心跳保活
      WebsocketUtil.timer = setInterval(() => {
        uni.sendSocketMessage({
          data: 'ping',
          success: res => {
            console.log('保活成功')
          },
          fail: err => {
            console.log('连接失败重新连接....:' + err)
            WebsocketUtil.websocketConnect(true)
          }
        })
      }, 30000)
    })

    uni.onSocketError(() => {
      console.log('触发了错误')
      // #ifndef MP
      UniUtil.delayTime(WebsocketUtil.failedReconnectTime).then(() => {
        WebsocketUtil.websocketConnect(true)
      })
      // #endif
    })

    uni.onSocketClose((e) => {
      console.log('触发了关闭:' + e)
      UniUtil.delayTime(WebsocketUtil.failedReconnectTime).then(() => {
        WebsocketUtil.websocketConnect(true)
      })
    })

    uni.onSocketMessage((res: any) => {
      const notify: NotifyVO = JsonUtils.jsonParse(res.data)
      // todo 直接将这个评论添加到talk中
      if (notify.type === NotifyType.comment) {
        appModule.addUnreadNotifies(notify.user)
      } else if (notify.type === NotifyType.message) {
        console.log('接受了消息')
        // 暂不支持圈子功能，推送的时候把所有未读都推送过来，还没做，匹配成功的话在talk和match页都显示匹配成功通知？，还有阅读消息后后台也要清0
        chatModule.pushChatAndMessagesAction(notify.chat)
      }
    })
  }

  static websocketClose () {
    uni.closeSocket()
  }
}
