export default class EditUserVO {
  nickname: string = null
  gender: string = null
  birthday: string = null
  location: string = null
  wxAccount: string = null
  qqAccount: string = null
  wbAccount: string = null

  constructor (nickname: string, gender: string, birthday: string, location: string, wxAccount: string, qqAccount: string, wbAccount: string) {
    this.nickname = nickname
    this.gender = gender
    this.birthday = birthday
    this.location = location
    this.wxAccount = wxAccount
    this.qqAccount = qqAccount
    this.wbAccount = wbAccount
  }
}
