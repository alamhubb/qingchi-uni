export default class ErrorCode {
  // 成功
  static readonly success: number = 200
  // 错误码
  // 未登录错误
  static readonly not_logged: number = 601
  // 业务错误
  static readonly business: number = 602
  // 自定义错误
  static readonly custom: number = 603
  // 系统异常
  static readonly system: number = 604
  // 封号异常
  static readonly banned: number = 605
}
