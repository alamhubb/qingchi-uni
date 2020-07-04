import http from '@/plugins/http'

export default class DistrictAPI {
  static queryDistrictsAPI () {
    return http.post('district/queryProvinceDistricts')
  }

  static queryHotDistrictsAPI () {
    return http.post('district/queryHotDistricts')
  }

  static queryHotProvinceDistricts () {
    return http.post('district/queryHotProvinceDistricts')
  }

  static queryUserRecentlyDistrictsAPI () {
    return http.post('district/queryUserRecentlyDistricts')
  }
}
