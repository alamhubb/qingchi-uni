import LoginDataVO from '@/model/login/LoginDataVO'
import UniUtil from '@/utils/UniUtil'
import { systemModule } from '@/plugins/store'
import ProviderType, { Provider } from '@/const/ProviderType'
import JsonUtils from '@/utils/JsonUtils'
import LoginAPI from '@/api/LoginAPI'
import UserVO from '@/model/user/UserVO'
import PlatformType from '@/const/PlatformType'
import Constants from '@/const/Constant'
import BalaBala from '@/utils/BalaBala'

export default class LoginService {
  static getLoginData (provider: Provider) {
    return UniUtil.login(provider).then((loginRes) => {
      const loginData: LoginDataVO = new LoginDataVO()
      loginData.provider = provider
      loginData.platform = systemModule.platform
      if (PlatformType.mp === loginData.platform) {
        loginData.code = loginRes.code
      } else {
        //数据本身为字符串，需要解析
        loginData.accessToken = JsonUtils.deepClone(loginRes.authResult).access_token
      }
      return loginData
    })
  }

  /**
   * 只有点击登录按钮时才会调用
   *
   * 以后需要考虑切换手机，登录同个账户的问题，也没准不用考虑，相同逻辑
   */
  static platformLogin (provider: Provider) {
    UniUtil.showLoading('登录中')
    // 小程序平台登陆
    return LoginService.getLoginData(provider).then((loginData: LoginDataVO) => {
      return UniUtil.getUserInfo(provider).then((infoRes) => {
        if (infoRes && infoRes.errMsg === Constants.loginSuccess) {
          if (PlatformType.mp === loginData.platform) {
            Object.assign(loginData, infoRes.userInfo)
            if (systemModule.isMpWX) {
              loginData.iv = infoRes.iv
              loginData.encryptedData = infoRes.encryptedData
            }
          } else {
            const userInfo: any = infoRes.userInfo
            if (!userInfo) {
              BalaBala.systemErrorMsg()
            }
            loginData.openId = userInfo.openId
            loginData.unionId = userInfo.unionId
            loginData.avatarUrl = userInfo.avatarUrl
            loginData.nickName = userInfo.nickName
            if (provider === ProviderType.qq) {
              loginData.gender = userInfo.gender_type
            } else if (provider === ProviderType.wx) {
              loginData.gender = userInfo.gender
            } else {
              UniUtil.error('错误的登陆方式')
            }
            loginData.birthday = userInfo.year
            loginData.city = userInfo.city || userInfo.province
          }
          return LoginAPI.platformLoginAPI(loginData).then((user: UserVO) => {
            let hintText = '登录成功'
            if (!user.phoneNum) {
              hintText += '，绑定手机号后才可发布内容'
            }
            UniUtil.hint(hintText)
          })
        } else {
          throw new Error('获取信息失败，请重试')
        }
      })
    }).finally(() => {
      UniUtil.hideLoading()
    })
  }
}
