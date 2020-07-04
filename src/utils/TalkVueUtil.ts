import StorageUtil from '@/utils/StorageUtil'
import TalkTabVO from '@/model/talk/TalkTabVO'
import TalkTabType from '@/const/TalkTabType'

const talkTabFollowDefault = new TalkTabVO()
talkTabFollowDefault.name = TalkTabType.follow_name
talkTabFollowDefault.type = TalkTabType.follow_type

const talkTabHomeDefault = new TalkTabVO()
talkTabHomeDefault.name = TalkTabType.home_name
talkTabHomeDefault.type = TalkTabType.home_type

const talkTabCityDefault = new TalkTabVO()
talkTabCityDefault.name = TalkTabType.city_name
talkTabCityDefault.type = TalkTabType.city_type

export default class TalkVueUtil {
  static readonly TalkTabsKey: string = 'talkTabs'
  static readonly TalkTabsDefault: TalkTabVO [] = [
    talkTabFollowDefault, talkTabHomeDefault, talkTabCityDefault
  ]

  static readonly talkTabIndexKey: string = 'talkTabIndex'
  static readonly talkTabIndexDefault: number = 1

  static readonly talkTabTypeKey: string = 'talkTabType'
  static readonly talkTabTypeDefault: string = TalkTabType.home_type


  static getTalkTabs (): TalkTabVO [] {
    const homeTypeTalks: TalkTabVO [] = StorageUtil.getObj(TalkVueUtil.TalkTabsKey)
    return homeTypeTalks || TalkVueUtil.TalkTabsDefault
  }

  static getCurTalkTabIndex (): number {
    let index = StorageUtil.getObj(TalkVueUtil.talkTabIndexKey)
    if (index !== 0) {
      index = index || TalkVueUtil.talkTabIndexDefault
    }
    return index
  }

  static getTalkTabType (): string {
    return StorageUtil.getObj(TalkVueUtil.talkTabTypeKey) || TalkVueUtil.talkTabTypeDefault
  }

  static setTalkTabsAll (talkTabs: TalkTabVO [], talkTabIndex: number, talkTabType: string) {
    if (talkTabs.length) {
      StorageUtil.setObj(TalkVueUtil.TalkTabsKey, talkTabs)
    }
    StorageUtil.setObj(TalkVueUtil.talkTabIndexKey, talkTabIndex)
    StorageUtil.setObj(TalkVueUtil.talkTabTypeKey, talkTabType)
  }
}
