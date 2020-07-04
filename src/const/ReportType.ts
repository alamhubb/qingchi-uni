/**
 * 举报类型
 */
export default class ReportType {
  static readonly noViolation: string = '没有违规'
  static readonly pornInfo: string = '涉污涉黄'
  static readonly sexy: string = '性感过度'
  static readonly unfriendly: string = '不友善行为'
  static readonly badAd: string = '不良广告'
  static readonly badInfo: string = '头像或昵称违规'
  static readonly lawbreaking: string = '违法违规'
  static readonly swindle: string = '欺骗诈骗'
  static readonly other: string = '其他违规'
}
