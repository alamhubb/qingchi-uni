import http from '@/plugins/http'

export default class DistrictAPI {
  static queryDistrictsAPI () {
    return http.post('district/queryProvinceDistricts')
  }

  //11.21查看系统未使用此接口，应该已作废
  static queryHotDistrictsAPI () {
    return http.post('district/queryHotDistricts')
  }

  //11.21查看系统未使用此接口，应该已作废
  static queryHotProvinceDistricts () {
    return http.post('district/queryHotProvinceDistricts')
  }

  static queryUserRecentlyDistrictsAPI () {
    return http.post('district/queryUserRecentlyDistricts')
  }
}
