import { systemModule } from '@/plugins/store'

export default class UserPayVO {
  platform: string
  provider: string
  amount: number
  payType: string

  constructor (provider: string, payType: string, amount?: number) {
    this.platform = systemModule.platform
    this.provider = provider
    this.payType = payType
    this.amount = amount
  }
}
