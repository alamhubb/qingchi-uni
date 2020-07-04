import { AMapWX } from '@/plugins/amap'
import AppConfig from '@/const/AppConfig'
import WebAPI from '@/plugins/WebAPI'

export default class MapUtil {
  static readonly map: AMapWX = new AMapWX({ key: AppConfig.ali_mp_map_key })

  static getLocationBySdk () {
    return new Promise((resolve, reject) => {
      MapUtil.map.getRegeo({
        success (data) {
          // 成功回调
          resolve(data.regeocodeData.addressComponent)
        },
        fail (info) {
          // 失败回调
          reject(info)
        }
      })
    })
  }

  static getLocationByWeb () {
    return WebAPI.get('https://restapi.amap.com/v3/ip?key=' + AppConfig.ali_web_map_key)
  }
}
