export default class ConfigMap {
  // 系统提示
  static readonly systemError601Key: string = 'systemError601'
  static readonly systemError601Default: string = '未登录，是否跳转至登录页'

  static readonly systemError604Key: string = 'systemError604'
  static readonly systemError604Default: string = '系统出错，有任何疑问请联系客服qq或微信：491369310'

  static readonly systemError605Key: string = 'systemError605'
  static readonly systemError605Default: string = '账号违规，被封禁，有任何疑问，联系客服微博：清池恋爱交友app，微信或qq:491369310'

  static readonly reportHideCountKey: string = 'reportHideCount'
  static readonly reportHideCountDefault: number = 1

  static readonly vipPriceKey: string = 'vipPrice'
  static readonly vipPriceDefault: number = 1000

  static readonly swiperHeightKey: string = 'swiperHeight'
  static readonly swiperHeightDefault: number = 260

  static readonly homeUrlKey: string = 'homeUrl'
  static readonly suggestUrlKey: string = 'suggestUrl'
  static readonly contactUsUrlKey: string = 'contactUsUrl'
  static readonly userAgreementUrlKey: string = 'userAgreementUrl'
  static readonly userPrivacyUrlKey: string = 'userPrivacyUrl'
  static readonly childProtectUrlKey: string = 'childProtectUrl'

  // 最后必须有/
  static readonly homeUrlDefault: string = 'https://www.qingchi1.com/'
  static readonly suggestUrlDefault: string = 'https://www.qingchi1.com/suggest'
  static readonly contactUsUrlDefault: string = 'https://www.qingchi1.com/contact'
  static readonly userAgreementUrlDefault: string = 'https://www.qingchi1.com/agreement'
  static readonly userPrivacyUrlDefault: string = 'https://www.qingchi1.com/privacy'
  static readonly childProtectUrlDefault: string = 'https://www.qingchi1.com/childProtect'

  // 验证码间隔多少秒
  static readonly authCodeIntervalKey: string = 'authCodeInterval'
  static readonly authCodeIntervalDefault: number = 60

  static readonly qqServiceKey: string = 'qqService'
  static readonly qqServiceDefault: string = '491369310'

  static readonly wxServiceKey: string = 'wxService'
  static readonly wxServiceDefault: string = '491369310'

  static readonly wbServiceKey: string = 'wbService'
  static readonly wbServiceDefault: string = '清池恋爱交友app'

  static readonly rewardedAdLimitKey: string = 'rewardedAdLimit'
  static readonly rewardedAdLimitDefault: number = 3

  static readonly talkCacheNumKey: string = 'talkCacheNum'
  static readonly talkCacheNumDefault: number = 4
}
