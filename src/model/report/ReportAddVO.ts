export default class ReportAddVO {
  public receiveUserId: number
  public talkId: number
  public commentId: number
  public userImgId: number
  public messageId: number
  public userImgIds: number[]
  public reportType: string
  public reportContentType: string
  public content: string
  public infoVersionNo: number

  constructor (reportContentType: string, reportType: string, content: string) {
    this.reportContentType = reportContentType
    this.reportType = reportType
    this.content = content
    this.infoVersionNo = 1
  }
}
