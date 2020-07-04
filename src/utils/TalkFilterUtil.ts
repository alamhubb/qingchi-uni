import StorageUtil from '@/utils/StorageUtil'

export default class TalkFilterUtil {
  static readonly minAgeFilterKey: string = 'minAgeFilter'
  static readonly maxAgeFilterKey: string = 'maxAgeFilter'
  static readonly genderFilterKey: string = 'genderFilter'
  // 附近
  static readonly minAgeFilterDefault: number = 8
  static readonly maxAgeFilterDefault: number = 40
  static readonly genderFilterDefault: string = '全部'

  static getMinAgeFilter (): number {
    return Number(StorageUtil.getObj(TalkFilterUtil.minAgeFilterKey)) || TalkFilterUtil.minAgeFilterDefault
  }

  static getMaxAgeFilter (): number {
    return Number(StorageUtil.getObj(TalkFilterUtil.maxAgeFilterKey)) || TalkFilterUtil.maxAgeFilterDefault
  }

  static getGenderFilter (): string {
    return StorageUtil.getObj(TalkFilterUtil.genderFilterKey) || TalkFilterUtil.genderFilterDefault
  }

  static setMinAgeFilter (minAge: number) {
    StorageUtil.setObj(TalkFilterUtil.minAgeFilterKey, minAge)
  }

  static setMaxAgeFilter (maxAge: number) {
    StorageUtil.setObj(TalkFilterUtil.maxAgeFilterKey, maxAge)
  }

  static setGenderFilter (genderFilter: string) {
    StorageUtil.setObj(TalkFilterUtil.genderFilterKey, genderFilter)
  }

  static setFilterData (genderFilter: string, minAge: number, maxAge: number) {
    TalkFilterUtil.setGenderFilter(genderFilter)
    TalkFilterUtil.setMinAgeFilter(minAge)
    TalkFilterUtil.setMaxAgeFilter(maxAge)
  }
}
