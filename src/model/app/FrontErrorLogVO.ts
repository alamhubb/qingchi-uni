import { systemModule } from '@/plugins/store'
import PlatformType from '@/const/PlatformType'

export default class FrontErrorLogVO {
  uri: string = null
  detail: string = null
  params: string = null
  errorMsg: string = null
  platform: string = null
  provider: string = null
  appVersion: number = null

  constructor (uri: string, detail: string, params: string, errorMsg: string) {
    this.uri = uri
    this.detail = detail
    this.params = params
    this.errorMsg = errorMsg
    this.platform = systemModule.platform
    if (this.platform === PlatformType.mp) {
      this.provider = systemModule.provider
    } else {
      this.appVersion = systemModule.appVersion
    }
  }
}
