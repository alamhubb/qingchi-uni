import DistrictVO from '@/model/DistrictVO'
import StorageUtil from '@/utils/StorageUtil'
import MapUtil from '@/utils/MapUtil'
import { appModule } from '@/plugins/store'

const chinaAdCode = '100000'
const initAdCode = '100001'

const chinaDistrict = new DistrictVO()
chinaDistrict.id = 1
chinaDistrict.adName = '中国'
chinaDistrict.provinceName = '中国'
chinaDistrict.adCode = chinaAdCode

const initDistrict = new DistrictVO()
//只在第一次进入系统查询时，设置初始值使用，查询之后就会把默认值替换了
initDistrict.adCode = initAdCode

export default class DistrictUtil {
  static readonly chinaAdCode = chinaAdCode

  static readonly initAdCode = initAdCode

  static readonly nationwide = '全国'

  static readonly districtKey = 'district'
  static readonly openPositionKey = 'openPosition'

  static readonly initDistrict: DistrictVO = initDistrict
  static readonly chinaDistrict: DistrictVO = chinaDistrict

  static openPosition () {
    StorageUtil.setObj(DistrictUtil.openPositionKey, '1')
  }

  static getOpenPosition () {
    return !!StorageUtil.get(DistrictUtil.openPositionKey)
  }

  static getDistrict (): DistrictVO {
    return StorageUtil.getObj(DistrictUtil.districtKey) || DistrictUtil.initDistrict
  }

  static setDistrict (district: DistrictVO) {
    StorageUtil.setObj(DistrictUtil.districtKey, district)
  }

  // 组合sdk和webapi
  static getCurPositionCom () {
    return DistrictUtil.getCurPositionBySDK().then((res: DistrictVO) => {
      return res
    }).catch(() => {
      return DistrictUtil.getCityByIpWebAPI().then((res: DistrictVO) => {
        return res
      })
    })
  }

  // 使用sdk精准定位
  static getCurPositionBySDK (): Promise<DistrictVO> {
    return MapUtil.getLocationBySdk().then((res: any) => {
      const lonAndLat: number[] = res.streetNumber.location.split(',')
      const district: DistrictVO = new DistrictVO()
      district.adCode = res.adcode
      district.provinceName = res.province
      district.districtName = res.district
      if (res.province !== res.city) {
        if (res.city) {
          if (Array.isArray(res.city)) {
            if (res.city.length) {
              district.cityName = res.city[0]
            }
          } else {
            district.cityName = res.city
          }
        }
      }
      district.adName = res.district
      district.lon = lonAndLat[0]
      district.lat = lonAndLat[1]
      district.isPosition = true
      //如果未开启定位的话开启定位
      if (!appModule.openPosition) {
        appModule.openPositionAction()
      }
      return district
    })
  }

  // 使用webapi粗略定位
  static async getCityByIpWebAPI () {
    return MapUtil.getLocationByWeb().then((res: any) => {
      if (res.info === 'OK') {
        const rectangle: string = res.rectangle
        const rectangleAry: string[] = rectangle.split(';')
        const lonAndLatAry: string[] = rectangleAry[0].split(',')
        const district: DistrictVO = new DistrictVO()
        district.adCode = res.adcode
        district.provinceName = res.province
        if (res.province !== res.city) {
          district.cityName = res.city
        }
        district.adName = res.city
        district.lon = Number(lonAndLatAry[0])
        district.lat = Number(lonAndLatAry[1])
        district.isPosition = true
        return district
      } else {
        throw new Error('获取位置失败')
      }
    })
  }

  /* static getCityByLatLonAPI (rectangle: string) {
    WebAPI.get(' https://restapi.amap.com/v3/geocode/regeo?key=a64bc4ccb330776939d57e229ca1e63b&location=' + rectangle).then(() => {
    })
  } */
}
