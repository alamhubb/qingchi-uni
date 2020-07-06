export default class CommonUtil {
  static throttle (f, wait) {
    let timer
    return (...args) => {
      if (timer) {
        return
      }
      timer = setTimeout(() => {
        f(...args)
        clearTimeout(timer)
        timer = null
      }, wait)
    }
  }

  static showShareMenu () {
    // #ifdef MP-QQ || MP-WEIXIN
    uni.showShareMenu()
    // #endif
  }

  static requestSubscribeMessage (tmplIds: string[]) {
    return new Promise((resolve, reject) => {
      uni.requestSubscribeMessage({
        tmplIds: tmplIds,
        success () {
          resolve()
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }

  static getLocation () {
    return new Promise((resolve, reject) => {
      uni.getLocation({
        geocode: true,
        type: 'gcj02',
        success (res) {
          resolve(res)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }
}
