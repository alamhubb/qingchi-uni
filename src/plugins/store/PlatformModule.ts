import { VuexModule, Module } from 'vuex-class-modules'
import AppConfig from '@/const/AppConfig'

@Module({ generateMutationSetters: true })
export default class PlatformModule extends VuexModule {
  qq_talkTemplateId: string = AppConfig.qq_talkTemplateId
  qq_commentTemplateId: string = AppConfig.qq_commentTemplateId
  qq_reportResultTemplateId: string = AppConfig.qq_reportResultTemplateId
  qq_violationTemplateId: string = AppConfig.qq_violationTemplateId

  wx_talkTemplateId: string = AppConfig.wx_talkTemplateId
  wx_commentTemplateId: string = AppConfig.wx_commentTemplateId
  wx_reportResultTemplateId: string = AppConfig.wx_reportResultTemplateId
  wx_violationTemplateId: string = AppConfig.wx_violationTemplateId

  // 用户发表动态，需要授权的通知
  get qq_talkTemplateIds (): string[] {
    return [this.qq_violationTemplateId, this.qq_commentTemplateId, this.qq_talkTemplateId]
  }

  // 用户发表评论，需要授权的通知
  get qq_commentTemplateIds (): string[] {
    return [this.qq_violationTemplateId, this.qq_commentTemplateId]
  }

  get qq_messageTemplateIds (): string[] {
    return [this.qq_violationTemplateId]
  }

  get qq_reportTemplateIds (): string[] {
    return [this.qq_reportResultTemplateId]
  }


  get wx_talkTemplateIds (): string[] {
    return [this.wx_violationTemplateId, this.wx_commentTemplateId, this.wx_talkTemplateId]
  }

  // 用户发表评论，需要授权的通知
  get wx_commentTemplateIds (): string[] {
    return [this.wx_violationTemplateId, this.wx_commentTemplateId]
  }

  get wx_messageTemplateIds (): string[] {
    return [this.wx_violationTemplateId]
  }

  get wx_reportTemplateIds (): string[] {
    return [this.wx_reportResultTemplateId]
  }
}
