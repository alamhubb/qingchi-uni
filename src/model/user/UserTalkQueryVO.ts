export default class UserTalkQueryVO {
  public userId: number
  public talkIds: number[]

  constructor (userId: number, talkIds: number[]) {
    this.userId = userId
    this.talkIds = talkIds
  }
}
