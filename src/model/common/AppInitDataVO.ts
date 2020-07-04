import UserVO from '@/model/user/UserVO'
import DistrictVO from '@/model/DistrictVO'
import ChatVO from '@/model/chat/ChatVO'
import TagTypeVO from '@/model/tag/TagTypeVO'
import HomeSwiperVO from '@/model/HomeSwiperVO'
import TagVO from '@/model/tag/TagVO'
import UnreadNotifyVO from '@/model/UnreadNotifyVO'
import AppConfig from '@/const/AppConfig'
import TalkTabVO from '@/model/talk/TalkTabVO'
import TalkVO from '@/model/talk/TalkVO'

export default class AppInitDataVO {
  user: UserVO = null
  notifies: UnreadNotifyVO [] = []

  wx_talkTemplateId: string = ''
  wx_commentTemplateId: string = ''
  wx_reportResultTemplateId: string = ''
  wx_violationTemplateId: string = ''

  qq_talkTemplateId: string = ''
  qq_commentTemplateId: string = ''
  qq_reportResultTemplateId: string = ''
  qq_violationTemplateId: string = ''

  chats: ChatVO[] = []

  appConfig: any = null
  tags: TagVO [] = []
  tagTypes: TagTypeVO [] = []
  reportTypes: string [] = []
  homeSwipers: HomeSwiperVO[] = []
  districts: DistrictVO[] = []
  onlineUsersCount: number = 0

  talks: TalkVO[] = []
  district: DistrictVO = null
}
