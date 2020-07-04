import http from '@/plugins/http'
import AppInitQueryVO from '@/model/common/AppInitQueryVO'

export default class AppInitAPI {
  static queryAppInitDataLoadAPI (initQueryVO: AppInitQueryVO) {
    return http.post('app/queryAppInitDataLoad', initQueryVO)
  }
  static queryAppInitDataReadyAPI () {
    return http.post('app/queryAppInitDataReady')
  }
}
