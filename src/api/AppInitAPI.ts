import http from '@/plugins/http'
import AppInitQueryVO from '@/model/common/AppInitQueryVO'
import AppUpdateVO from '@/model/app/AppUpdateVO'
import AppUpdateResultVO from '@/model/app/AppUpdateResultVO'

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
}
