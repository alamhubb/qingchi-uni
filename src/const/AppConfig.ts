export default class AppConfig {
  static readonly websocketUrl: string = process.env.VUE_APP_Websocket

  static readonly title: string = '清池app - 00后恋爱交友app'
  static readonly keywords: string = '年轻人,扩列,处对象,交友,cdx,处qy,处vy,处闺蜜,处兄弟,谈恋爱,处cp,游戏,兴趣社区,年轻人交友,年轻人社区'
  static readonly description: string = '这是一个00后专属的交友app，00后，交友就上清池app，来这里找到你心怡的小哥哥小姐姐，找到一起开黑的小伙伴，找到志同道合的朋友'

  // qq相关
  // qq小程序商户
  static readonly qq_bargainor_id: string = process.env.VUE_APP_QQ_BARGAINOR_ID
  //app广告id
  static readonly app_feed_ad_id: string = '1890536227'
  static readonly app_award_ad_id: string = '1947278043'
  //qq小程序广告id
  static readonly qq_award_ad_id: string = '15b6ff769075dd0a970a82ae39a510d0'
  static readonly qq_insert_ad_id: string = '3cbc95081ae975fdcae3e8ea615e5a7d'

  static qq_talkTemplateId: string = '1c53b12e6f6ad82f3fb0557b02eaf20b'
  static qq_commentTemplateId: string = '46e57d8a10b67d8c9278788410933b61'
  static qq_reportResultTemplateId: string = 'c39c7d30d130ed170c103363d9ca2fff'
  static qq_violationTemplateId: string = '2128bec457f63527f91311f54da520b7'

  //微信相关
  //wx小程序广告id
  static readonly wx_award_ad_id: string = 'adunit-214a21564a070b18'
  //微信商户号
  static readonly wx_app_id: string = process.env.VUE_APP_WX_APP_ID
  static readonly wx_partnerid_id: string = process.env.VUE_APP_WX_PARTNERID_ID

  static wx_talkTemplateId: string = 'mLMGMJWfz5dJVVclHIFCacD4hdMmIAly60TpQ1NF6hc'
  static wx_commentTemplateId: string = '-lNlHFDVTCFM53t-UnDa6GIqdm_JsCrQbuj7VW9PwfM'
  static wx_reportResultTemplateId: string = 'uiNkA0C5mmt_edJvDEXzVhr8Fe_T2VYAafoM_Vu04iM'
  static wx_violationTemplateId: string = 'sXNJQqr8qLmkrc2bag94vKuNs5IGRDjHU_fuIqN7pW4'

  //app相关

  //高德
  // 高德地图 小程序sdk key
  static readonly ali_web_map_key: string = process.env.VUE_APP_ALI_WEB_MAP_KEY
  // 高德地图 webapi key
  static readonly ali_mp_map_key: string = process.env.VUE_APP_ALI_MP_MAP_KEY

  // 意见反馈
  static readonly suggestTitle: string = '建议与反馈'

  // 联系我们
  static readonly contactTitle: string = '联系我们'

  // 用户协议
  static readonly userAgreementTitle: string = '用户协议'

  // 隐私政策
  static readonly userPrivacyTitle: string = '隐私政策'

  // 儿童保护政策
  static readonly childProtectTitle: string = '儿童信息保护规则及监护人须知'

  // 儿童保护政策
  static readonly shellInfoTitle: string = '贝壳介绍'
}
