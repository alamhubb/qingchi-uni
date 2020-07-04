import { v4 as uuidv4 } from 'uuid'
import GetSystemInfoResult = UniApp.GetSystemInfoResult
import GetProviderRes = UniApp.GetProviderRes
import LoginRes = UniApp.LoginRes
import { Provider } from '@/const/ProviderType'
import GetUserInfoRes = UniApp.GetUserInfoRes

export default class UniUtils {
  public static delayTime (millisecond: number): Promise<any> {
    return new Promise<any>(resolve =>
      setTimeout(() => {
        resolve()
      }, millisecond))
  }

  public static textCopy (copyText: string, hint?: string) {
    return new Promise((resolve, reject) => {
      uni.setClipboardData({
        data: copyText,
        success () {
          if (hint) {
            uni.hideToast()
            UniUtils.toast(hint)
          }
          resolve()
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }

  public static createRewardedVideoAd (adUnitId: string) {
    return uni.createRewardedVideoAd({
      adUnitId: adUnitId
    })
  }

  static copyLink (webUrl: string) {
    return UniUtils.textCopy(webUrl, '链接已复制，可在浏览器打开')
  }

  public static getUUID (): string {
    const randoms: number[] = []
    for (let i = 0; i < 16; i++) {
      randoms.push(Math.round(Math.random() * 255))
    }
    return uuidv4({
      random: randoms
    }).replace(/-/g, '')
  }

  public static upxToPx (rpx: number): number {
    return uni.upx2px(rpx)
  }

  public static login (provider: Provider) {
    return new Promise<LoginRes>(resolve => {
      uni.login({
        provider: provider,
        success (loginRes) {
          resolve(loginRes)
        }
      })
    })
  }

  public static getUserInfo (provider: Provider) {
    return new Promise<GetUserInfoRes>(resolve => {
      uni.getUserInfo({
        provider: provider,
        success (userInfo) {
          resolve(userInfo)
        }
      })
    })
  }

  public static getSystemInfo (): Promise<GetSystemInfoResult> {
    return new Promise<any>(resolve =>
      uni.getSystemInfo({
        success: (res) => {
          resolve(res)
        }
      })
    )
  }

  public static getProvider (): Promise<GetProviderRes> {
    return new Promise<any>(resolve =>
      uni.getProvider({
        service: 'oauth',
        success: (res) => {
          resolve(res)
        }
      })
    )
  }

  //交互
  public static toast (title: string, time?: number) {
    return new Promise((resolve, reject) => {
      uni.showToast({
        icon: 'none',
        title: title,
        duration: time || 800,
        success () {
          resolve()
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }

  public static toastLong (title: string) {
    return new Promise((resolve, reject) => {
      uni.showToast({
        icon: 'none',
        title: title,
        duration: 1500,
        success () {
          resolve()
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }

  public static action (msg: string, okLabel?: string) {
    return new Promise((resolve, reject) => {
      uni.showModal({
        content: msg,
        confirmText: okLabel || '确定',
        success (res) {
          if (res.confirm) {
            resolve()
          } else if (res.cancel) {
            reject(new Error('点击了取消'))
          }
        }
      })
    })
  }

  public static info (msg: string, okLabel?: string) {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: '提示',
        content: msg,
        confirmText: okLabel || '确定',
        success (res) {
          if (res.confirm) {
            resolve()
          } else if (res.cancel) {
            reject(new Error('点击了取消'))
          }
        }
      })
    })
  }

  public static hint (msg: string, okLabel?: string) {
    return new Promise((resolve, reject) => {
      uni.showModal({
        content: msg,
        showCancel: false,
        confirmText: okLabel || '确定',
        success (res) {
          if (res.confirm) {
            resolve()
          } else if (res.cancel) {
            reject(new Error('点击了取消'))
          }
        }
      })
    })
  }

  public static warning (msg: string, okLabel?: string) {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: '警告',
        content: msg,
        confirmText: okLabel || '确定',
        success (res) {
          if (res.confirm) {
            resolve()
          } else if (res.cancel) {
            reject(new Error('点击了取消'))
          }
        }
      })
    })
  }

  public static error (msg: string, title?: string) {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: title || '错误',
        content: msg,
        showCancel: false,
        success (res) {
          if (res.confirm) {
            resolve()
          } else if (res.cancel) {
            reject(new Error('点击了取消'))
          }
        }
      })
    })
  }

  public static showLoading (loadText: string) {
    uni.showLoading({ title: loadText || '' })
  }

  public static hideLoading () {
    uni.hideLoading()
  }

  public static actionSheet (itemList: string[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      uni.showActionSheet({
        itemList: itemList,
        success (res) {
          resolve(res.tapIndex)
        },
        fail (res) {
          reject(res.errMsg)
        }
      })
    })
  }
}
