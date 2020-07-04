export default class TalkDelete {
  public msgId: number
  public deleteReason: string
  public violation: boolean

  constructor (msgId: number, deleteReason: string, violation: boolean) {
    this.msgId = msgId
    this.deleteReason = deleteReason
    this.violation = violation
  }
}
