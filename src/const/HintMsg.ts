export default class HintMsg {
  static readonly contactService: string = '，请联系客服QQ：491369310'

  static readonly vipOpenFailMsg: string = '开通会员失败' + HintMsg.contactService

  static readonly payFailMsg: string = '充值失败' + HintMsg.contactService

  static readonly payCancelMsg: string = '您取消了充值'

  static readonly paySuccessMsg: string = '充值成功'

  static readonly uploadFailMsg: string = '上传失败' + HintMsg.contactService

  static readonly identityAuthSuccess: string = '认证成功，是否回到个人信息页面'

  static readonly imgSizeNotGt10MB: string = '图片大小不能超过10MB！'
}
