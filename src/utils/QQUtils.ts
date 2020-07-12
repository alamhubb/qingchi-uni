import PageUtil from '@/utils/PageUtil'
import UniUtil from './UniUtil'
import AppConfig from '@/const/AppConfig'
import UserStore from '@/plugins/store/UserStore'
import PagePath from '@/const/PagePath'
import UserAPI from '@/api/UserAPI'
import ProviderType from '@/const/ProviderType'
import HintMsg from '@/const/HintMsg'
import UserPayResultVO from '@/model/user/UserPayResultVO'

export default class QQUtils {
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
      qq.requestPayment({
        package: payResult.package,
        bargainor_id: AppConfig.qq_bargainor_id,
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
