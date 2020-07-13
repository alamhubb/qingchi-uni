import QQUtils from '@/utils/QQUtils'
import CommonUtil from '@/utils/CommonUtil'
import { platformModule, systemModule, userModule } from '@/plugins/store'
import WxUtils from '@/utils/WxUtils'
import UniUtil from './UniUtil'
import UserAPI from '@/api/UserAPI'
import UserStore from '@/plugins/store/UserStore'
import PageUtil from '@/utils/PageUtil'
import PagePath from '@/const/PagePath'
import HintMsg from '@/const/HintMsg'
import Constants from '@/const/Constant'
import MsgUtil from '@/utils/MsgUtil'
import UserPayResultVO from '@/model/user/UserPayResultVO'
import BalaBala from '@/utils/BalaBala'

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


  // 统一处理各平台的支付
  static shellPay (amount: number) {
    return UserAPI.userPayAPI(systemModule.provider, amount).then((res) => {
      return PlatformUtils.userPay(res.data)
    })
  }

  // 统一处理各平台的支付
  static payVip () {
    UserAPI.payVipAPI(systemModule.provider).then((res) => {
      return PlatformUtils.userPay(res.data)
    })
  }

  //负责统一处理跳转到刷新用户并跳转到用户页面
  static userPay (res: UserPayResultVO) {
    return PlatformUtils.cashPay(res)
      .then(() => {
        UserStore.getMineUserAction().then(() => {
          UniUtil.hint(HintMsg.paySuccessMsg)
          PageUtil.reLaunch(PagePath.userMine)
        })
      })
  }

  static async cashPay (res: UserPayResultVO): Promise<any> {
    if (!userModule.user) {
      return BalaBala.unLoginMessage()
    } else if (systemModule.isIos) {
      MsgUtil.iosDisablePay()
      throw ''
    } else if (!systemModule.isMp) {
      MsgUtil.notMpDisablePay()
      throw ''
    }
    return PlatformUtils.requestPayment(res)
      .catch((err) => {
        if (err.errMsg === Constants.payCancel) {
          UniUtil.toast(HintMsg.payCancelMsg)
          throw err
        } else {
          MsgUtil.payFailMsg()
          throw err
        }
      })
  }

  //会员走payVip
  //会员走userPay
  //会员走cashPay
  //底层requestPayment处理平台差异。
  static requestPayment (payResult: UserPayResultVO) {
    if (systemModule.isMpQQ) {
      return QQUtils.requestPayment(payResult)
    } else if (systemModule.isMpWX) {
      return WxUtils.requestPayment(payResult)
    } else {
      throw '不存在的支付渠道'
    }
  }
}
