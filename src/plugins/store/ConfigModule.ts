import { VuexModule, Module } from 'vuex-class-modules'
import ConfigMap from '@/const/ConfigMap'
import Lodash from '@/utils/Lodash'

@Module({ generateMutationSetters: true })
export default class ConfigModule extends VuexModule {
  // 后台控制是否展示talk页的轮播图
  showSwipers = true
  // 动态页展示广告,设置一些默认值，在这里设置还是去使用的地方设置
  appConfig: any = {}

  // 会员价格
  get vipPrice (): number {
    // 为空返回默认值
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.vipPriceDefault
    } else {
      return this.appConfig[ConfigMap.vipPriceKey]
    }
  }

  // 首页swiper高度
  get swiperHeight (): number {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.swiperHeightDefault
    } else {
      return this.appConfig[ConfigMap.swiperHeightKey]
    }
  }

  // 首页weburl 基础url高度
  get homeUrl (): string {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.homeUrlDefault
    } else {
      return this.appConfig[ConfigMap.homeUrlKey]
    }
  }

  // 首页weburl 基础url高度
  get suggestUrl (): string {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.suggestUrlDefault
    } else {
      return this.appConfig[ConfigMap.suggestUrlKey]
    }
  }

  get contactUsUrl (): string {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.contactUsUrlDefault
    } else {
      return this.appConfig[ConfigMap.contactUsUrlKey]
    }
  }

  get userAgreementUrl (): string {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.userAgreementUrlDefault
    } else {
      return this.appConfig[ConfigMap.userAgreementUrlKey]
    }
  }

  get userPrivacyUrl (): string {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.userPrivacyUrlDefault
    } else {
      return this.appConfig[ConfigMap.userPrivacyUrlKey]
    }
  }

  get childProtectUrl (): string {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.childProtectUrlDefault
    } else {
      return this.appConfig[ConfigMap.childProtectUrlKey]
    }
  }

  // 首页weburl 基础url高度
  get authCodeInterval (): number {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.authCodeIntervalDefault
    } else {
      return this.appConfig[ConfigMap.authCodeIntervalKey]
    }
  }

  // 错误提示
  get systemError601 (): string {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.systemError601Default
    } else {
      return this.appConfig[ConfigMap.systemError601Key]
    }
  }

  get systemError604 (): string {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.systemError604Default
    } else {
      return this.appConfig[ConfigMap.systemError604Key]
    }
  }

  get systemError605 (): string {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.systemError605Default
    } else {
      return this.appConfig[ConfigMap.systemError605Key]
    }
  }

  get reportHideCount (): number {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.reportHideCountDefault
    } else {
      return this.appConfig[ConfigMap.reportHideCountKey]
    }
  }

  get qqService (): string {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.qqServiceDefault
    } else {
      return this.appConfig[ConfigMap.qqServiceKey]
    }
  }

  get wbService (): string {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.wbServiceDefault
    } else {
      return this.appConfig[ConfigMap.wbServiceKey]
    }
  }

  get rewardedAdLimit (): number {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.rewardedAdLimitDefault
    } else {
      return this.appConfig[ConfigMap.rewardedAdLimitKey]
    }
  }

  get talkCacheNum (): number {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.talkCacheNumDefault
    } else {
      return this.appConfig[ConfigMap.talkCacheNumKey]
    }
  }

  get [ConfigMap.contactExpenseShellKey] (): number {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.contactExpenseShellDefault
    } else {
      return this.appConfig[ConfigMap.contactExpenseShellKey]
    }
  }

  get [ConfigMap.sysServiceReceiveRatioKey] (): number {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.sysServiceReceiveRatioDefault
    } else {
      return this.appConfig[ConfigMap.sysServiceReceiveRatioKey]
    }
  }

  get [ConfigMap.contactUserReceiveShellKey] (): number {
    if (Lodash.isEmpty(this.appConfig)) {
      return ConfigMap.contactUserReceiveShellDefault
    } else {
      const expenseShell = this[ConfigMap.contactExpenseShellKey]
      const ratio = this[ConfigMap.sysServiceReceiveRatioKey]
      return expenseShell * ratio / 10
    }
  }
}
