/* eslint-disable */
import JsonUtils from '@/utils/JsonUtils'
import CosAPI from '@/api/CosAPI'
import COS from 'cos-wx-sdk-v5'
import CosConst from '@/const/CosConst'
import ImgFileVO from '@/model/ImgFileVO'
import UniUtil from './UniUtil'
import HintMsg from '@/const/HintMsg'

export default class CosUtil {
  static postObject (imgFile: ImgFileVO, cos = CosUtil.getAuthorizationCos()) {
    return new Promise<any>((resolve, reject) => {
      cos.postObject({
        Bucket: CosConst.bucketName,
        Region: CosConst.region,
        Key: imgFile.src,
        FilePath: imgFile.path
      }, (err, data) => {
        if (!err) {
          resolve(data)
        } else {
          UniUtil.hideLoading()
          UniUtil.error(HintMsg.uploadFailMsg)
          reject(err)
        }
      })
    })
  }

  static postObjectList (imgSrcs: ImgFileVO[]) {
    const cos = CosUtil.getAuthorizationCos()
    return Promise.all(imgSrcs.map(imgFile => CosUtil.postObject(imgFile, cos)))
  }

  static getAuthorizationCos () {
    return new COS({
      // ForcePathStyle: true, // 如果使用了很多存储桶，可以通过打开后缀式，减少配置白名单域名数量，请求时会用地域域名
      getAuthorization (options, callback) {
        // 异步获取临时密钥
        CosAPI.getCosAuthorizationAPI().then((res: any) => {
          const data = JsonUtils.jsonParse(res.data)
          const credentials = data && data.credentials
          if (!data || !credentials) return console.error('credentials invalid')
          callback({
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            XCosSecurityToken: credentials.sessionToken,
            // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
            StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
            ExpiredTime: data.expiredTime // 时间戳，单位秒，如：1580000900
          })
        })
      }
    })
  }
}
