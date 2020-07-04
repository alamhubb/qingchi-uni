import UserStore from '@/plugins/store/UserStore'

export default class TokenUtil {
  // 开发生产区分token，避免混淆，不区分的话会冲突
  private static readonly token: string = 'token'
  private static readonly dev_token: string = 'dev_token'

  static set (token: string) {
    if (process.env.NODE_ENV === 'development') {
      uni.setStorageSync(this.dev_token, token)
    } else {
      uni.setStorageSync(this.token, token)
    }
  }

  static get (): string {
    // 开发环境方便测试
    if (process.env.NODE_ENV === 'development') {
      return uni.getStorageSync(this.dev_token)
    } else {
      return uni.getStorageSync(this.token)
    }
  }

  static hasToken (): boolean {
    return !!TokenUtil.get()
  }

  static remove () {
    if (process.env.NODE_ENV === 'development') {
      uni.removeStorageSync(this.dev_token)
    } else {
      uni.removeStorageSync(this.token)
    }
    UserStore.setMineUser(null)
  }
}
