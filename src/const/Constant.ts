export default class Constants {
  static readonly loginSuccess = 'getUserInfo:ok'
  static readonly wxPayCancel = 'requestPayment:fail cancel'
  static readonly qqPayCancel = 'requestPayment:fail 用户取消支付'

  static readonly second = 1000
  static readonly minute: number = 60 * Constants.second
  static readonly hour: number = 60 * Constants.minute

  // 用户在线图标颜色
  static readonly onlineColor: string = 'text-green'
  // 用户离线图标颜色
  static readonly offlineColor: string = 'text-grey'

  static readonly showUploadImgHintKey: string = 'showUploadImgHint'
  static readonly showMatchHintKey: string = 'showMatchHint'
  static readonly showChatHintKey: string = 'showChatHint'
  static readonly showMsgHintKey: string = 'showMsgHint'
  // 客服微博名称key
  static readonly weibo_account_key: string = '微博账号'
  static readonly weibo_account_default: string = '清池恋爱交友app'
  static readonly lastShowAdTime: string = 'lastShowAdTime'
  // talk页30分钟展示一次广告
  static readonly talkShowAdTimeIntervalDefault: number = 30
  static readonly talkShowAdTimeInterval: string = '广告展示分钟间隔'
  // 动态分页数量，默认10
  static readonly everyLoadNum: string = '每次加载动态数量'
  static readonly everyLoadNum_number: number = 10
  static readonly matchUserEveryLoadNum_number: number = 20
  static readonly matchUserEveryLoadNum_Key: string = '匹配页每次加载数量'

  static readonly rewardedAdLimit: string = '每天观看激励视频限制次数'
  static readonly talkShowAdIndexListKey: string = '动态页展示广告索引列表'
  static readonly rewardedAdLimitDefault: number = 3

  static readonly talkShowAdIndexAryDefault: number[] = [7, 15, 27, 43, 63, 87, 111, 135, 159, 183, 207, 231, 255, 279, 303, 327, 351, 375, 399, 423, 447, 471, 495, 519]

  static readonly leftKey: string = 'left'
  static readonly rightKey: string = 'right'
}
