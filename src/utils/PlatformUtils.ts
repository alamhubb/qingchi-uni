import QQUtils from '@/utils/QQUtils'
import CommonUtil from '@/utils/CommonUtil'
import { platformModule } from '@/plugins/store'

// 统一处理各平台的订阅
export default class PlatformUtils {
  // talk相关订阅
  static requestSubscribeTalk () {
    // #ifdef MP-WEIXIN
    PlatformUtils.requestSubscribeMessage(platformModule.wx_talkTemplateIds)
    // #endif
    // #ifdef MP-QQ
    PlatformUtils.requestSubscribeMessage(platformModule.qq_talkTemplateIds)
    // #endif
  }

  // Comment相关订阅
  static requestSubscribeComment () {
    // #ifdef MP-WEIXIN
    PlatformUtils.requestSubscribeMessage(platformModule.wx_commentTemplateIds)
    // #endif
    // #ifdef MP-QQ
    PlatformUtils.requestSubscribeMessage(platformModule.qq_commentTemplateIds)
    // #endif
  }

  // Chat Message 相关订阅
  static requestSubscribeChat () {
    // #ifdef MP-WEIXIN
    PlatformUtils.requestSubscribeMessage(platformModule.wx_messageTemplateIds)
    // #endif
    // #ifdef MP-QQ
    PlatformUtils.requestSubscribeMessage(platformModule.qq_messageTemplateIds)
    // #endif
  }

  // Report相关订阅
  static requestSubscribeReport () {
    // #ifdef MP-WEIXIN
    PlatformUtils.requestSubscribeMessage(platformModule.wx_reportTemplateIds)
    // #endif
    // #ifdef MP-QQ
    PlatformUtils.requestSubscribeMessage(platformModule.qq_reportTemplateIds)
    // #endif
  }

  // 统一处理各平台的订阅
  static requestSubscribeMessage (tmplIds: string[]) {
    // #ifdef MP-WEIXIN
    CommonUtil.requestSubscribeMessage(tmplIds)
    // #endif
    // #ifdef MP-QQ
    QQUtils.subscribeAppMsg(tmplIds)
    // #endif
  }
}
