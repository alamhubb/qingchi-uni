import AppConfig from '@/const/AppConfig'
import { configModule } from '@/plugins/store'
import SkipUtil from '@/utils/SkipUtil'

export default class SkipUrlConst {
  static homeUrl (): string {
    return SkipUtil.getWebUrl(configModule.homeUrl, AppConfig.title)
  }

  static suggestUrl (): string {
    return SkipUtil.getWebUrl(configModule.suggestUrl, AppConfig.suggestTitle)
  }

  static contactUsUrl (): string {
    return SkipUtil.getWebUrl(configModule.contactUsUrl, AppConfig.contactTitle)
  }

  static userAgreementUrl (): string {
    return SkipUtil.getWebUrl(configModule.userAgreementUrl, AppConfig.userAgreementTitle)
  }

  static userPrivacyUrl (): string {
    return SkipUtil.getWebUrl(configModule.userPrivacyUrl, AppConfig.userPrivacyTitle)
  }

  static childProtectUrl (): string {
    return SkipUtil.getWebUrl(configModule.childProtectUrl, AppConfig.childProtectTitle)
  }
}
