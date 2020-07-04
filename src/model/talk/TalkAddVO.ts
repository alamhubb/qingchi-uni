import DistrictVO from '@/model/DistrictVO'
import ImgFileVO from '@/model/ImgFileVO'

export default class TalkAddVO {
  public content: string
  public adCode: string
  public imgs: ImgFileVO []
  public tagIds: number[]
  // 经度,经度范围-180~180
  public lon: number = null
  // 纬度,纬度范围-90~90
  public lat: number = null

  constructor (content: string, imgs: ImgFileVO[], district: DistrictVO, tagIds: number[]) {
    this.content = content
    this.imgs = imgs
    this.adCode = district.adCode
    this.tagIds = tagIds
    if (district) {
      this.lon = district.lon
      this.lat = district.lat
    }
  }
}
