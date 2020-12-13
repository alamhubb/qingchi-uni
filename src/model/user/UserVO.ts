import DistrictVO from '@/model/DistrictVO'
import ImgFileVO from '@/model/ImgFileVO'
import ChatVO from '@/model/chat/ChatVO'

export default class UserVO {
  id: number = null
  nickname: string = null
  gender: string = null
  avatar: string = null
  age: number = null
  location: string = null
  birthday: string = null
  imgs: ImgFileVO [] = null
  // 用来区分是否已经喜欢过
  likeDisabled: boolean = null
  idCardStatus: string = null
  faceRatio: number = null
  baseFaceRatio: number = null
  likeCount: number = null
  onlineFlag: boolean = null
  lastOnlineTime: Date = null
  // 是否为vip，
  vipFlag: boolean = null
  // 是否为年会员
  yearVipFlag: boolean = null
  // 邀请码，你分享给别人的邀请码
  inviteCode: string = null
  // 邀请人，谁邀请的你
  registerInviteUser: UserVO = null
  // vip到期时间
  vipEndDate: Date = null
  // 用户拥有的清池币数量
  qcb: number = null
  fansNum: number = null
  followNum: number = null
  talkQueryDistrict: DistrictVO = null
  hasFollowed = true
  wxAccount: string = null
  qqAccount: string = null
  wbAccount: string = null
  userType: string = null
  followStatus: string = null
  // 对方是否关注了自己
  beFollow: boolean = null
  loveValue: number = null
  justiceValue: number = null
  phoneNum: string = null
  reportNum: number = null
  isMine: boolean = null
  isSelfAuth: boolean = null
  authNum: number = null
  //展示联系方式
  showUserContact: boolean = null
  contactAccount: string = null
  //贝壳
  shell: number = null
  //经验值
  experience: number = null
  //用户是否展示联系方式
  openContact: boolean = null
  //是否允许发送消息
  allowSendMsg: boolean = null
  // showBuyMsg: boolean = null
  chat: ChatVO = null
}
