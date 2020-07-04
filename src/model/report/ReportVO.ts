import UserVO from '@/model/user/UserVO'

export default class ReportVO {
  public user: UserVO
  public status: string
  public types: string[]
  public reportContentType: string
  public content: string
  public opposeRatio: number
  public supportRatio: number
  public memberCount: number
}
