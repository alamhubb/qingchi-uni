import { appModule, systemModule } from '@/plugins/store'
import DistrictUtil from '@/utils/DistrictUtil'
import DistrictVO from '@/model/DistrictVO'
import TalkFilterUtil from '@/utils/TalkFilterUtil'
import TalkTabVO from '@/model/talk/TalkTabVO'

export default class AppInitQueryVO {
  //上次退出时记录的adCode
  public adCode: string
  public homeType: string
  public gender: string
  public minAge: number
  public maxAge: number
  public lon: number
  public lat: number
  public openPosition: boolean
  public platform: string
  public standby: string

  constructor (tabObj: TalkTabVO, district: DistrictVO) {
    //如果为初始才传ad
    if (appModule.openPosition) {
      this.openPosition = appModule.openPosition
      DistrictUtil.getCurPositionBySDK().then((res: DistrictVO) => {
        if (res) {
          this.lon = res.lon
          this.lat = res.lat
        }
      })
    }
    this.adCode = district.adCode
    this.homeType = tabObj.type
    this.gender = TalkFilterUtil.getGenderFilter()
    this.minAge = TalkFilterUtil.getMinAgeFilter()
    this.maxAge = TalkFilterUtil.getMaxAgeFilter()
    this.platform = systemModule.platform
  }
}
