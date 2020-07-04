import DistrictVO from '@/model/DistrictVO'

export default class TalkQueryVO {
  public talkIds: number[]
  public adCode: string
  public lon: number
  public lat: number
  public tagIds: number[]
  public homeType: string
  public gender: string
  public minAge: number
  public maxAge: number

  constructor (talkIds: number[], district: DistrictVO, tagIds: number[], homeType: string, gender: string, minAge: number, maxAge: number) {
    this.talkIds = talkIds
    if (district) {
      this.adCode = district.adCode
      this.lon = district.lon
      this.lat = district.lat
    }
    this.tagIds = tagIds
    this.homeType = homeType
    this.gender = gender
    this.minAge = minAge
    this.maxAge = maxAge
  }
}
