import { VuexModule, Module, Action } from 'vuex-class-modules'
import WebsocketUtil from '@/utils/WebsocketUtil'
import { appModule } from '@/plugins/store/index'
import ProviderType, { Provider } from '@/const/ProviderType'
import PlatformType from '@/const/PlatformType'
import GetSystemInfoResult = UniApp.GetSystemInfoResult

@Module({ generateMutationSetters: true })
export default class SystemModule extends VuexModule {
  // 条件编译属性
  isApp = false
  isMp = false
  isMpQQ = false
  isMpWX = false
  isH5 = false

  // 条件编译属性
  // ios android h5,默认安卓
  platform = PlatformType.app
  // 登陆平台
  provider: Provider = 'qq'
  isIos = false
  systemInfo: GetSystemInfoResult = null
  screenHeight = 0
  windowHeight = 0
  //减去状态栏和导航栏的高度
  contentHeight = 0
  statusBarHeight = 0
  navBarHeight = 44
  titleHeight = 0

  @Action
  appInit () {
    this.requestUpdate()
    WebsocketUtil.websocketConnect(false)
    // 初始化数据看一下这些请求是否可以合并 登陆之后也要链接websocket
    appModule.initGlobalDataLoadAPI()
    // 不为app平台在这里设置platform否则在systemInfo中设置
    // 执行获取系统信息的函数
    this.getSystemInfo()
  }

  @Action
  requestUpdate () {
    // 如果小程序平台则需要更新
    // #ifdef MP
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate(() => {
    })
    updateManager.onUpdateReady(() => {
      uni.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed()
    // #endif
  }

  @Action
  // 动态页展示广告,设置一些默认值，在这里设置还是去使用的地方设置
  getSystemInfo () {
    // #ifdef APP-PLUS
    this.isApp = true
    this.platform = PlatformType.app
    // #endif
    // #ifdef MP
    this.isMp = true
    this.platform = PlatformType.mp
    // #endif
    // #ifdef MP-WEIXIN
    this.isMpWX = true
    this.provider = ProviderType.wx
    // #endif
    // #ifdef MP-QQ
    this.isMpQQ = true
    this.provider = ProviderType.qq
    // #endif
    // #ifdef H5
    this.isH5 = true
    this.platform = PlatformType.h5
    // #endif
    // 判断是否为ios平台
    const systemInfo: GetSystemInfoResult = uni.getSystemInfoSync()
    this.systemInfo = systemInfo
    //获取是否苹果平台
    const model: string = systemInfo.model
    //小程序开发工具时会为 devtools
    const platform: string = systemInfo.platform
    if ((platform && (platform === PlatformType.ios)) || (model && (model.indexOf('iPhone') > -1 || model.indexOf('iPad') > -1))) {
      this.isIos = true
    }
    this.screenHeight = systemInfo.screenHeight
    this.windowHeight = systemInfo.windowHeight
    this.statusBarHeight = systemInfo.statusBarHeight
    this.titleHeight = this.statusBarHeight + this.navBarHeight
    this.contentHeight = this.screenHeight - this.titleHeight
  }
}
