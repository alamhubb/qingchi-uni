import AppInitAPI from '@/api/AppInitAPI'
import UniUtil from '@/utils/UniUtil'
import AppUpdateType from '@/const/AppUpdateType'
import { configModule } from '@/plugins/store'
import AppConfig from '@/const/AppConfig'

export default class APPUtil {
  static checkUpdate () {
    plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
      const version = widgetInfo.version.split('.').join('')
      AppInitAPI.checkUpdateAPI(Number(version)).then((res) => {
        const updateType = res.data.updateType
        const updateUrl = res.data.updateUrl
        console.log(updateType)
        console.log(updateUrl)
        if (AppUpdateType.install === updateType) {
          UniUtil.action('应用需要更新，请点击更新，即前往应用商店更新', '更新').then(() => {
            plus.runtime.openURL(updateUrl)
          })
        } else if (AppUpdateType.hot === updateType) {
          UniUtil.install(updateUrl).then(() => {
            UniUtil.action('新版本更新成功，是否现在重启清池app', '重启', '稍后').then(() => {
              plus.runtime.restart()
            })
          }).catch(() => {
            UniUtil.hint('更新失败，' + configModule.contactService)
          })
        }
      })
    })
  }

  static createRewardedVideoAd () {
    return UniUtil.createRewardedVideoAd(AppConfig.app_award_ad_id)
  }
}
