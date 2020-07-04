export default class SettingUtil {
  static readonly userLocationKey: string = 'scope.userLocation'

  //仅mp平台
  static hasUserLocationAuth (): Promise<any> {
    return new Promise((resolve, reject) => {
      uni.getSetting({
        success (res) {
          if (res.authSetting[SettingUtil.userLocationKey]) {
            resolve()
          } else {
            reject(new Error('用户未授权'))
          }
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }
}
