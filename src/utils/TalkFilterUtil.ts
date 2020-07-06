import StorageUtil from '@/utils/StorageUtil'

export default class TalkFilterUtil {
  static readonly minAgeFilterKey: string = 'minAgeFilter'
  static readonly maxAgeFilterKey: string = 'maxAgeFilter'
  static readonly genderFilterKey: string = 'genderFilter'
  static readonly notFirstSetAgeKey: string = 'notFirstSetAge'
  // 附近
  static readonly minAgeFilterDefault: number = 8
  static readonly maxAgeFilterDefault: number = 40
  static readonly genderFilterDefault: string = '全部'

  static getNotFirstSetAge (): boolean {
    return !!StorageUtil.getObj(TalkFilterUtil.notFirstSetAgeKey)
  }

  static getMinAgeFilter (): number {
    return Number(StorageUtil.getObj(TalkFilterUtil.minAgeFilterKey)) || TalkFilterUtil.minAgeFilterDefault
  }

  static getMaxAgeFilter (): number {
    return Number(StorageUtil.getObj(TalkFilterUtil.maxAgeFilterKey)) || TalkFilterUtil.maxAgeFilterDefault
  }

  static getGenderFilter (): string {
    return StorageUtil.getObj(TalkFilterUtil.genderFilterKey) || TalkFilterUtil.genderFilterDefault
  }

  static setFilterData (genderFilter: string, minAge: number, maxAge: number) {
    StorageUtil.setObj(TalkFilterUtil.genderFilterKey, genderFilter)
    StorageUtil.setObj(TalkFilterUtil.minAgeFilterKey, minAge)
    StorageUtil.setObj(TalkFilterUtil.maxAgeFilterKey, maxAge)
  }

  static setFistSetUserAge (minAge: number, maxAge: number) {
    StorageUtil.setObj(TalkFilterUtil.notFirstSetAgeKey, true)
    StorageUtil.setObj(TalkFilterUtil.minAgeFilterKey, minAge)
    StorageUtil.setObj(TalkFilterUtil.maxAgeFilterKey, maxAge)
  }
}
