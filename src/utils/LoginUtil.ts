export default class LoginUtil {
  static checkSession (): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      uni.checkSession({
        success () {
          resolve()
        },
        fail (err) {
          reject(err)
        }
      })
    )
  }
}
