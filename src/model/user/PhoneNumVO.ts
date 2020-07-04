export default class PhoneNumVO {
  phoneNum: string = null
  authCode: string = null
  platform: string = null

  constructor (phoneNum: string, authCode: string, platform: string) {
    this.phoneNum = phoneNum
    this.authCode = authCode
    this.platform = platform
  }
}
