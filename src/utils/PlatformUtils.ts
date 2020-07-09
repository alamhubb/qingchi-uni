import QQUtils from '@/utils/QQUtils'
import CommonUtil from '@/utils/CommonUtil'
import { platformModule, systemModule } from '@/plugins/store'
import WxUtils from '@/utils/WxUtils'
import UniUtils from '@/utils/UniUtils'
import UserAPI from '@/api/UserAPI'
import UserStore from '@/plugins/store/UserStore'
import PageUtil from '@/utils/PageUtil'
import PagePath from '@/const/PagePath'
import HintMsg from '@/const/HintMsg'
import Constants from '@/const/Constant'

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

  static userPay (amount: number) {
    if (systemModule.isMp) {
      PlatformUtils.requestPayment(amount)
        .then(() => {
          UserStore.getMineUserAction().then(() => {
            UniUtils.hint(HintMsg.paySuccessMsg)
            PageUtil.reLaunch(PagePath.userMine)
          })
        })
        .catch((err) => {
          console.log(err)
          if (err.errMsg === Constants.payCancel) {
            UniUtils.toast(HintMsg.payCancelMsg)
          } else {
            UniUtils.error(HintMsg.payFailMsg)
          }
        })
    } else {
      UniUtils.hint('非小程序平台暂不支持开通VIP')
    }
  }

  // 统一处理各平台的支付
  static requestPayment (amount: number) {
    return UserAPI.userPayAPI(systemModule.provider, amount).then((res) => {
      if (systemModule.isMpQQ) {
        return QQUtils.userPay(amount, res.data)
      } else if (systemModule.isMpWX) {
        return WxUtils.userPay(amount, res.data)
      } else {
        throw '不存在的支付渠道'
      }
    })
  }

  // 统一处理各平台的支付
  static payVip () {
    if (systemModule.isMp) {
      if (systemModule.isMpQQ) {
        QQUtils.payVipAPI()
      } else if (systemModule.isMpWX) {
        WxUtils.payVipAPI()
      }
    } else {
      UniUtils.hint('非小程序平台暂不支持开通VIP')
    }
  }
}
