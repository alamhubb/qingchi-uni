import JsonUtils from '@/utils/JsonUtils'
import TokenUtil from '@/utils/TokenUtil'
import ErrorCode from '@/const/ErrorCode'
import UniUtils from '@/utils/UniUtils'

export default class ImgUtil {
  static readonly imgUrl: string = process.env.VUE_APP_COS_URL
  // static readonly imgUrl: string = process.env.VUE_APP_BASE + 'img/'
  static readonly uploadImgUrl: string = process.env.VUE_APP_BASE + 'upload/img/'

  static uploadImgNewAPI (uploadImg: string, type: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      uni.uploadFile({
        url: ImgUtil.uploadImgUrl,
        header: {
          token: TokenUtil.get()
        },
        filePath: uploadImg,
        name: 'file',
        formData: { // 后台以post方式接收
          type: type// 自己系统中的用户id
        },
        success: res => {
          if (res.statusCode === ErrorCode.success) {
            resolve(JsonUtils.jsonParse(res.data))
          } else {
            reject(JsonUtils.jsonParse(res.data))
          }
        },
        fail: res => {
          reject(res)
        }
      })
    })
  }

  static uploadImgAPI (uploadImg: string, type: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      uni.uploadFile({
        url: ImgUtil.uploadImgUrl,
        header: {
          token: TokenUtil.get()
        },
        filePath: uploadImg,
        name: 'file',
        formData: { // 后台以post方式接收
          type: type// 自己系统中的用户id
        },
        success: res => {
          if (res.statusCode === ErrorCode.success) {
            resolve(JsonUtils.jsonParse(res.data))
          } else {
            reject(JsonUtils.jsonParse(res.data))
          }
        },
        fail: res => {
          reject(res)
        }
      })
    })
  }

  static getTalkLargeImgUrl (userId: number, src: string): string {
    // 如果包含'/'则代表是新逻辑
    let imgUrl = null
    if (src) {
      if (src.indexOf('https') > -1) {
        imgUrl = src + '!normal'
      } else {
        if (src.split('/').length > 1) {
          imgUrl = ImgUtil.imgUrl + src + '!normal'
        } else {
          imgUrl = ImgUtil.imgUrl + 'user/' + userId + '/talk/normal/' + src + '!normal'
        }
      }
    }
    return imgUrl
  }

  static getTalkSmallImgUrl (userId: number, src: string): string {
    // 如果包含'/'则代表是新逻辑
    let imgUrl = null
    if (src) {
      if (src.indexOf('https') > -1) {
        imgUrl = src
      } else {
        if (src.split('/').length > 1) {
          imgUrl = ImgUtil.imgUrl + src + '!thumbnail'
        } else {
          imgUrl = ImgUtil.imgUrl + 'user/' + userId + '/talk/thumbnail/' + src
        }
      }
    }
    return imgUrl
  }

  static getUserSmallImgUrl (src: string): string {
    return src + '!thumbnail'
  }

  static getUserLargeImgUrl (src: string): string {
    return src + '!normal'
  }

  static getTalkUploadFormat (userId: number, filePath: string): string {
    return 'user/' + userId + '/talk/normal/' + UniUtils.getUUID() + ImgUtil.getFileSuffixName(filePath)
  }

  static getUserAvatarUploadFormat (userId: number, filePath: string): string {
    return 'user/' + userId + '/avatar/' + UniUtils.getUUID() + ImgUtil.getFileSuffixName(filePath)
  }

  static getUserImgUploadFormat (userId: number, filePath: string): string {
    return 'user/' + userId + '/img/' + UniUtils.getUUID() + ImgUtil.getFileSuffixName(filePath)
  }

  static getUserIdentityUploadFormat (userId: number, filePath: string): string {
    return 'user/' + userId + '/identity/' + UniUtils.getUUID() + ImgUtil.getFileSuffixName(filePath)
  }

  static getFileSuffixName (filePath: string): string {
    let fileSuffixName = filePath.substr(filePath.lastIndexOf('/') + 1)
    fileSuffixName = fileSuffixName.substr(fileSuffixName.lastIndexOf('.') + 1)
    const fileSuffixNameAry: string[] = fileSuffixName.split('.')
    if (fileSuffixNameAry.length > 1) {
      fileSuffixName = '.' + fileSuffixNameAry[fileSuffixNameAry.length - 1]
    } else {
      fileSuffixName = '.jpg'
    }
    return fileSuffixName
  }

  /* static getTalkLargeImgUrl(userId: number): string {
    return ImgUtil.imgUrl + 'talk/' + userId + '/normal/'
  }

  static getTalkSmallImgUrl(userId: number): string {
    return ImgUtil.imgUrl + 'talk/' + userId + '/thumbnail/'
  } */
}
