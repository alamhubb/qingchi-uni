import UniUtil from './UniUtil'
import AppConfig from '@/const/AppConfig'
import UserPayResultVO from '@/model/user/UserPayResultVO'

export default class WxUtils {
  static subscribeAppMsg (tmplIds: string[]) {
    return new Promise((resolve, reject) => {
      qq.subscribeAppMsg({
        tmplIds: tmplIds,
        subscribe: true,
        success () {
          resolve()
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }

  static createRewardedVideoAd () {
    return UniUtil.createRewardedVideoAd(AppConfig.qq_award_ad_id)
  }

  static createInterstitialAd () {
    return qq.createInterstitialAd({
      adUnitId: AppConfig.qq_insert_ad_id
    })
  }

  static async requestPayment (payResult: UserPayResultVO): Promise<void> {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: payResult.timeStamp,
        nonceStr: payResult.nonceStr,
        package: payResult.package,
        signType: 'MD5',
        paySign: payResult.paySign,
        success () {
          resolve()
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }
}
