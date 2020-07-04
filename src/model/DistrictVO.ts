export default class DistrictVO {
  public id: number = null
  public provinceName: string = null
  public cityName: string = null
  public districtName: string = null
  public adCode: string = null
  public adName: string = null
  public talkCount: number = null
  public childs: DistrictVO[] = null
  public count: number = null
  // 经度,经度范围-180~180
  public lon: number = null
  // 纬度,纬度范围-90~90
  public lat: number = null
  // 是否为定位，为定位的话会显示定位图标
  public isPosition = false
}
