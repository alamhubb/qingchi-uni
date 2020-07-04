import http from '@/plugins/http'

export default class CosAPI {
  static getCosAuthorizationAPI () {
    return http.post('cos/getCosAuthorization')
  }
}
