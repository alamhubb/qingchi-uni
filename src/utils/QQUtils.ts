import PageUtil from '@/utils/PageUtil'
import UniUtils from '@/utils/UniUtils'
import AppConfig from '@/const/AppConfig'
import UserStore from '@/plugins/store/UserStore'
import PagePath from '@/const/PagePath'
import UserAPI from '@/api/UserAPI'
import ProviderType from '@/const/ProviderType'
import ErrorMsg from '@/const/ErrorMsg'

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
    return UniUtils.createRewardedVideoAd(AppConfig.qq_award_ad_id)
  }

  static createInterstitialAd () {
    return qq.createInterstitialAd({
      adUnitId: AppConfig.qq_insert_ad_id
    })
  }

  static payVipAPI () {
    UserAPI.payVipAPI(ProviderType.qq).then((res: any) => {
      qq.requestPayment({
        package: res.data.package,
        bargainor_id: AppConfig.qq_bargainor_id,
        success () {
          UserStore.getMineUserAction().then(() => {
            UniUtils.hint('开通会员成功')
            PageUtil.reLaunch(PagePath.userMine)
          })
        },
        fail () {
          UniUtils.error(ErrorMsg.vipOpenFailMsg)
        }
      })
    })
  }
}
