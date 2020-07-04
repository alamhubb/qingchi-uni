export default class CosConst {
  // 系统
  static readonly region: string = 'ap-beijing'
  static readonly bucketName: string = process.env.VUE_APP_COS_BUCKET
}
