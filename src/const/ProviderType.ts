export default class ProviderType {
  static readonly wx: 'weixin' = 'weixin'
  static readonly qq: 'qq' = 'qq'
  static readonly phone = 'phone'
}

export type Provider = 'weixin' | 'qq'
