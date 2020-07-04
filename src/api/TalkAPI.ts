import TalkAddVO from '@/model/talk/TalkAddVO'
import http from '@/plugins/http'
import CommentAddVO from '@/model/comment/CommentAddVO'
import HugAddVO from '@/model/HugAddVO'
import TalkQueryVO from '@/model/talk/TalkQueryVO'
import UserTalkQueryVO from '@/model/user/UserTalkQueryVO'
import DistrictVO from '@/model/DistrictVO'
import TalkDeleteVO from '@/model/talk/TalkDeleteVO'
import CommentDeleteVO from '@/model/comment/CommentDeleteVO'
import ImgFileVO from '@/model/ImgFileVO'

export default class TalkAPI {
  static addTalkAPI (content: string, imgs: ImgFileVO[], district: DistrictVO, tagIds: number[]) {
    const data: TalkAddVO = new TalkAddVO(content, imgs, district, tagIds)
    return http.post('talk/addTalk', data)
  }

  static queryOtherTabTalksAPI (talkIds: number[], district: DistrictVO, tagIds: number[], homeType: string, gender: string, minAge: number, maxAge: number) {
    return http.post('talk/queryOtherHomeTypeTalks', new TalkQueryVO(talkIds, district, tagIds, homeType, gender, minAge, maxAge))
  }

  static queryTalksAPI (talkIds: number[], district: DistrictVO, tagIds: number[], homeType: string, gender: string, minAge: number, maxAge: number) {
    return http.post('talk/queryTalks', new TalkQueryVO(talkIds, district, tagIds, homeType, gender, minAge, maxAge))
  }

  static queryUserTalksAPI (userId: number, talkIds: number[]) {
    return http.post('talk/queryUserTalks', new UserTalkQueryVO(userId, talkIds))
  }

  static queryTalkDetailAPI (talkId: number) {
    return http.post('talk/queryTalkDetail?talkId=' + talkId)
  }

  static addCommentAPI (comment: CommentAddVO) {
    return http.post('comment/addComment', comment)
  }

  static addHugAPI (hug: HugAddVO) {
    return http.post('hug/addHug', hug)
  }

  static deleteTalkAPI (talkId: number) {
    return http.post('talk/deleteTalk', new TalkDeleteVO(talkId))
  }

  static deleteCommentAPI (commentId: number) {
    return http.post('comment/deleteComment', new CommentDeleteVO(commentId))
  }
}
