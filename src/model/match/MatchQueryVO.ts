export default class MatchQueryVO {
  public userIds: number[]
  public lon: number
  public lat: number
  public matchType: string

  constructor (talkIds: number[], matchType: string) {
    this.userIds = talkIds
    this.matchType = matchType
  }
}
