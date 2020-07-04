import http from '@/plugins/http'
import FollowAddVO from '@/model/FollowAddVO'

export default class FollowAPI {
  static addFollowAPI (followAdd: FollowAddVO) {
    return http.post('follow/addFollow', followAdd)
  }

  static cancelFollowAPI (followAdd: FollowAddVO) {
    return http.post('follow/cancelFollow', followAdd)
  }

  static queryUserFollowsAPI () {
    return http.post('follow/queryUserFollows')
  }
}
