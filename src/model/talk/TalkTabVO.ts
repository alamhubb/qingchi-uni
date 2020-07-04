import TalkVO from '@/model/talk/TalkVO'
import LoadMoreType from '@/const/LoadMoreType'

export default class TalkTabVO {
  name: string
  type: string
  talks: TalkVO[] = []
  firstLoad: boolean = true
  loadMore: string = LoadMoreType.more
}
