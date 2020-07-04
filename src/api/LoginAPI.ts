import LoginDataVO from '@/model/login/LoginDataVO'
import http from '@/plugins/http'
import UserStore from '@/plugins/store/UserStore'
import PhoneNumVO from '@/model/user/PhoneNumVO'
import { systemModule } from '@/plugins/store'

export default class LoginAPI {
  static platformLoginAPI (loginData: LoginDataVO) {
    return http.post('user/platformLogin', loginData).then((res: any) => {
      UserStore.loginAfter(res)
      return res.data.user
    })
  }

  static nmpAppLoginAPI (phoneNum: string, authCode: string) {
    const phoneNumObj: PhoneNumVO = new PhoneNumVO(phoneNum, authCode, systemModule.platform)
    return http.post('phone/appLogin', phoneNumObj).then((res: any) => {
      UserStore.loginAfter(res)
      return res.data
    })
  }

  static bindPhoneNumAPI (loginData: LoginDataVO) {
    return http.post('user/bindPhoneNum', loginData)
  }
}
