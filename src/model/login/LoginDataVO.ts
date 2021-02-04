import ProviderType from '@/const/ProviderType'

export default class LoginDataVO {
  provider: string = ProviderType.qq
  platform = ''

  //设备id
  clientid = ''

  openId = ''
  unionId = ''
  //app三方登陆使用
  accessToken = ''
  //小程序三方登陆使用
  code = ''

  nickName = ''
  avatarUrl = ''
  gender: number = null
  birthday = ''
  city = ''

  phoneNum = ''
  authCode = ''

  //百度小程序使用
  encryptedData = ''
  iv = ''
  //微信绑定手机号使用
  sessionEnable = false

  //暂未使用
  inviteCode = ''
}
