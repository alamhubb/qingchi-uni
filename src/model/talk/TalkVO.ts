import UserVO from '@/model/user/UserVO'
import CommentVO from '@/model/comment/CommentVO'
import DistrictVO from '@/model/DistrictVO'
import TagVO from '@/model/tag/TagVO'
import ImgFileVO from '@/model/ImgFileVO'

export default class TalkVO {
  public id: number = null
  public content: string = null
  public imgs: ImgFileVO [] = null
  public user: UserVO = null
  public createTime: Date = null
  public updateTime: Date = null
  public comments: CommentVO[] = null
  public commentNum: number = null
  public hugNum: number = null
  public reportNum: number = null
  public hasHugged: boolean = null
  // 是否已关注
  public hasFollowed: boolean = null
  public district: DistrictVO = null
  public tags: TagVO [] = null
  public distance: number = null
  public globalTop: number = null
  // 以后支持修改了，可以修改，但是要支持查看历史版本，显示，修改过，查看历史版本
}
