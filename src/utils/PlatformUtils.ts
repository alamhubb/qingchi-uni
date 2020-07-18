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
import MPUtil from '@/utils/MPUtil'
import APPUtil from '@/utils/APPUtil'
import AppInitAPI from '@/api/AppInitAPI'

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
  static userPay (provider: string, payType: string, amount?: number) {
    return PlatformUtils.pay(provider, payType, amount).then(() => {
      UserStore.getMineUserAction().then(() => {
        UniUtil.hint(HintMsg.paySuccessMsg)
        PageUtil.reLaunch(PagePath.userMine)
      })
    })
  }

  //所有只能直接调用这个
  static async pay (provider: string, payType: string, amount?: number) {
    if (!userModule.user) {
      return BalaBala.unLoginMessage()
    } else if (systemModule.isIos) {
      MsgUtil.iosDisablePay()
      throw ''
    }
    return UserAPI.userPayAPI(provider, payType, amount).then((res) => {
      return PlatformUtils.cashPay(res.data)
    })
  }

  private static async cashPay (res: UserPayResultVO): Promise<any> {
    return PlatformUtils.requestPayment(res)
      .catch((err) => {
        // qq的取消支付没有走着里
        if (err.errMsg === Constants.wxPayCancel || err.errMsg === Constants.qqPayCancel || err.errMsg === Constants.appWxPayCancel) {
          UniUtil.toast(HintMsg.payCancelMsg)
          throw err
        } else {
          AppInitAPI.sendErrorLog(null, '支付失败', res, err)
          MsgUtil.payFailMsg()
          throw err
        }
      })
  }

  //会员走payVip
  //会员走userPay
  //会员走cashPay
  //底层requestPayment处理平台差异。
  private static async requestPayment (payResult: UserPayResultVO) {
    if (systemModule.isMpQQ) {
      return QQUtils.requestPayment(payResult)
    } else if (systemModule.isMpWX || systemModule.isApp) {
      return WxUtils.requestPayment(payResult)
    } else {
      throw '不存在的支付渠道'
    }
  }

  static checkUpdate () {
    // #ifdef MP
    MPUtil.checkUpdate()
    // #endif
    // #ifdef APP-PLUS
    APPUtil.checkUpdate()
    // #endif
  }
}
