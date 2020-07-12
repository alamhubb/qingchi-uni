export default class UserPayVO {
  provider: string
  amount: number
  payType: string

  constructor (provider: string, payType: string, amount?: number) {
    this.provider = provider
    this.payType = payType
    this.amount = amount
  }
}
