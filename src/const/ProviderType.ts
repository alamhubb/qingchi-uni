export default class ProviderType {
  static readonly wx: wx = 'weixin'
  static readonly qq: qq = 'qq'
  static readonly phone: phone = 'phone'
}

export type wx = 'weixin'
export type qq = 'qq'
export type phone = 'phone'

export type Provider = wx | qq | phone
