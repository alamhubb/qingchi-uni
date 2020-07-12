import http from '@/plugins/http'
import UserQueryVO from '@/model/user/UserQueryVO'
import EditUserVO from '@/model/EditUserVO'
import PhoneNumVO from '@/model/user/PhoneNumVO'
import ImgFileVO from '@/model/ImgFileVO'
import UserPayVO from '@/model/user/UserPayVO'
import UserPayResultVO from '@/model/user/UserPayResultVO'
import PayType from '@/const/PayType'

export default class UserAPI {
  static getMineUserInfoAPI () {
    return http.post('user/mine')
  }

  static queryUserDetailAPI (userId: number) {
    return http.post('user/queryUserDetail', new UserQueryVO(userId))
  }

  static editUserAPI (user: EditUserVO) {
    return http.post('user/edit', user)
  }

  static sendAuthCodeAPI (phoneNum: string) {
    return http.post('phone/sendAuthCode?phoneNum=' + phoneNum)
  }

  static bindPhoneNumAPI (phoneNum: string, authCode: string) {
    const phoneNumObj: PhoneNumVO = new PhoneNumVO(phoneNum, authCode, null)
    return http.post('phone/bindPhoneNum', phoneNumObj)
  }

  static addUserImgAPI (userImg: ImgFileVO) {
    return http.post('user/addImg', userImg)
  }

  static deleteUserImgAPI (userImg: ImgFileVO) {
    return http.post('user/deleteImg', userImg)
  }

  static identityAuthAPI (userImg: ImgFileVO) {
    return http.post('identity/auth', userImg)
  }

  static updateAvatarAPI (avatar: string) {
    return http.post('user/updateAvatar?avatar=' + avatar)
  }

  static getUserContactAPI (userId: number) {
    const user = new UserQueryVO(userId)
    return http.post<string>('user/getUserContact', user)
  }

  static switchUserContactAPI (openContact: boolean) {
    return http.post<string>('user/switchUserContact?openContact=' + openContact)
  }

  static payVipAPI (platform: string) {
    return http.post<UserPayResultVO>('user/payVip?platform=' + platform)
  }

  static userPayAPI (platform: string, amount?: number) {
    const userPayVO = new UserPayVO(platform, PayType.shell, amount)
    return http.post<UserPayResultVO>('user/pay', userPayVO)
  }
}
