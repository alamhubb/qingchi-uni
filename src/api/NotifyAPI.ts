import http from '@/plugins/http'

export default class NotifyAPI {
  static queryNotifies () {
    return http.post('notify/queryNotifies')
  }

  static queryUnreadNotifies () {
    return http.post('notify/queryUnreadNotifies')
  }

  static queryUnreadNotifiesAndUpdateHasRead () {
    return http.post('notify/queryUnreadNotifiesAndUpdateHasRead')
  }
}
