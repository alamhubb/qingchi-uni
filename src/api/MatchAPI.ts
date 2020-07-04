import http from '@/plugins/http'
import MatchQueryVO from '@/model/match/MatchQueryVO'

export default class MatchAPI {
  static queryMatchUsersAPI (userIds: number[], matchType: string) {
    return http.post('match/queryMatchUsers', new MatchQueryVO(userIds, matchType))
  }

  static likeUserAPI (userId: number) {
    return http.post('match/likeMatchUser?userId=' + userId)
  }

  static unlikeUserAPI (userId: number) {
    return http.post('match/unlikeMatchUser?userId=' + userId)
  }
}
