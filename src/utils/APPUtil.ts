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
        const updateHint = res.data.updateHint
        if (AppUpdateType.install === updateType) {
          const hint = updateHint || '应用有新版本需要安装，点击安装即可更新'
          UniUtil.action(hint, '安装').then(() => {
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
