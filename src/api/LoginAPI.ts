import LoginDataVO from '@/model/login/LoginDataVO'
import http from '@/plugins/http'
import UserStore from '@/plugins/store/UserStore'
import { systemModule } from '@/plugins/store'

export default class LoginAPI {
  static platformLoginAPI (loginData: LoginDataVO) {
    if (systemModule.isApp) {
      loginData.clientid = systemModule.clientid
    }
    return http.post('user/platformLogin', loginData).then((res: any) => {
      UserStore.loginAfter(res)
      return res.data.user
    })
  }

  //微信绑定手机号使用
  static bindPhoneNumAPI (loginData: LoginDataVO) {
    return http.post('user/bindPhoneNum', loginData)
  }
}
