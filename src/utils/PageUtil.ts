import PagePath from '../const/PagePath'
import store, { chatModule, systemModule, userModule } from '@/plugins/store'
import UniUtil from './UniUtil'
import UserVO from '@/model/user/UserVO'
import ChatVO from '@/model/chat/ChatVO'
import BalaBala from '@/utils/BalaBala'
import SkipUtil from '@/utils/SkipUtil'
import SkipType from '@/const/SkipType'
import SkipUrlConst from '@/const/SkipUrlConst'
import MsgUtil from '@/utils/MsgUtil'

export default class PageUtil {
  /**
   * 保留当前页面，跳转到应用内的某个页面，使用uni.navigateBack可以返回到原页面。
   * @param pagePath
   * @param params
   */
  static navigateTo (pagePath: string, params?: object): void {
    if (params) {
      const paramObj = new URLSearchParams()
      for (const key in params) {
        paramObj.append(key, params[key])
      }
      pagePath = pagePath + '?' + paramObj.toString()
    }
    uni.navigateTo({ url: pagePath })
  }

  static navigateToAll (type: string, skipUrl: string, pageTitle: string) {
    if (type === SkipType.mp) {
      PageUtil.navigateToMp(skipUrl, pageTitle)
    } else if (type === SkipType.web) {
      PageUtil.navigateToWeb(skipUrl, pageTitle)
    } else if (type === SkipType.local) {
      PageUtil.navigateTo(skipUrl)
    } else {
      PageUtil.toWebHome()
    }
  }

  static toWebHome (): void {
    PageUtil.navigateTo(SkipUrlConst.homeUrl())
  }


  static navigateToWeb (webUrl: string, pageTitle?: string): void {
    PageUtil.navigateTo(SkipUtil.getWebUrl(webUrl, pageTitle))
  }

  static navigateToMp (appId: string, path?: string): void {
    uni.navigateToMiniProgram({
      appId: appId,
      path: path
    })
  }

  /**
   * 关闭当前页面，跳转到应用内的某个页面，需要跳转的应用内非 tabBar 的页面的路径。
   * @param pagePath
   */
  static redirectTo (pagePath: string): void {
    uni.redirectTo({ url: pagePath })
  }

  /**
   * 关闭所有页面，打开到应用内的某个页面。，如果跳转的页面路径是 tabBar 页面则不能带参数
   * @param pagePath
   */
  static reLaunch (pagePath: string): void {
    uni.reLaunch({ url: pagePath })
  }

  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面，跳转到 tabBar 页面只能使用 switchTab 跳转。
   * @param pagePath
   */
  static switchTab (pagePath: string): void {
    if (systemModule.isApp) {
      uni.showTabBar()
    }
    uni.switchTab({ url: pagePath })
  }

  /**
   * 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层。
   */
  static goBack (): void {
    uni.navigateBack()
  }

  static goHome (): void {
    PageUtil.toTalkPage()
  }

  static getCurrentPageURI (): string {
    return '/' + getCurrentPages()[getCurrentPages().length - 1].route
  }

  static getCurrentPage (): any {
    return getCurrentPages()[getCurrentPages().length - 1]
  }

  static toVipPage () {
    const isIos: boolean = systemModule.isIos
    if (isIos) {
      // 由于相关规范，iOS功能暂不可用
      MsgUtil.iosDisablePay()
    } else {
      const user: UserVO = userModule.user
      if (user) {
        PageUtil.navigateTo(PagePath.userVip)
      } else {
        BalaBala.unLoginMessage()
      }
    }
  }

  static toShellPage () {
    if (systemModule.isIos) {
      // 由于相关规范，iOS功能暂不可用
      MsgUtil.iosDisablePay()
    } else {
      if (userModule.user) {
        PageUtil.navigateTo(PagePath.userShell)
      } else {
        BalaBala.unLoginMessage()
      }
    }
  }

  static toLoveValuePage () {
    PageUtil.navigateTo(PagePath.loveValue)
  }

  static toMinePage () {
    PageUtil.switchTab(PagePath.userMine)
  }

  static toTalkAddPage () {
    const user: UserVO = userModule.user
    if (user && user.phoneNum) {
      PageUtil.navigateTo(PagePath.talkAdd)
    } else {
      BalaBala.unBindPhoneNum()
    }
  }

  static toPhonePage () {
    PageUtil.navigateTo(PagePath.userPhone)
  }

  static toTalkPage () {
    PageUtil.switchTab(PagePath.talk)
  }

  static toIdentityAuthPage () {
    PageUtil.navigateTo(PagePath.identityAuth)
  }

  static toUserMatchPage (user: UserVO) {
    store.commit('match/setUser', user)
    // PageUtil.navigateTo(PagePath.userMatch)
  }

  static toMessagePage (chat: ChatVO) {
    //需要先清除，再跳转页面
    chatModule.setChatAction(chat)
    PageUtil.navigateTo(PagePath.message)
  }

  static toFaceValuePage () {
    UniUtil.action('是否查看颜值分介绍').then(() => {
      PageUtil.navigateTo(PagePath.faceValueInfo)
    })
  }

  static toUserContactInfoPage () {
    PageUtil.navigateTo(PagePath.userContactInfo)
  }
  static toMessageSetting () {
    PageUtil.navigateTo(PagePath.messageSetting)
  }
}
