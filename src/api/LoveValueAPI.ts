import http from '@/plugins/http'

export default class LoveValueAPI {
  static watchVideoAdsAPI (success: boolean) {
    return http.post('loveValue/watchVideoAd2?success=' + success)
  }

  static queryTodayLoveValueAPI () {
    return http.post('loveValue/queryTodayLoveValue')
  }
}
