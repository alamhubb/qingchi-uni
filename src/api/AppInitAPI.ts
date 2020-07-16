import http from '@/plugins/http'
import AppInitQueryVO from '@/model/common/AppInitQueryVO'
import AppUpdateVO from '@/model/app/AppUpdateVO'
import AppUpdateResultVO from '@/model/app/AppUpdateResultVO'
import FrontErrorLogVO from '@/model/app/FrontErrorLogVO'
import JsonUtils from '@/utils/JsonUtils'

export default class AppInitAPI {
  static queryAppInitDataLoadAPI (initQueryVO: AppInitQueryVO) {
    return http.post('app/queryAppInitDataLoad', initQueryVO)
  }

  static queryAppInitDataReadyAPI () {
    return http.post('app/queryAppInitDataReady')
  }

  static checkUpdateAPI (versionCode: number) {
    const appUpdate = new AppUpdateVO(versionCode)
    return http.post<AppUpdateResultVO>('app/checkUpdate', appUpdate)
  }

  static sendErrorLog (uri: string, detail: string, params: any, errorMsg: any) {
    return http.post('app/sendErrorLog', new FrontErrorLogVO(uri, detail, JsonUtils.toJson(params), JsonUtils.toJson(errorMsg)))
  }
}
