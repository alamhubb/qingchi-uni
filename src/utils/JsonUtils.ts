export default class JsonUtils {
  // 改成any类型
  public static deepClone (object: any): any {
    return JSON.parse(JSON.stringify(object))
  }

  public static toJson (object: any): string {
    return JSON.stringify(object)
  }

  public static jsonParse (objJson: string): any {
    return JSON.parse(objJson)
  }

  public static log (object: any) {
    console.log(JSON.stringify(object))
  }

  static toFormData(object: Object): FormData {
    const formData = new FormData()
    Object.keys(object).forEach((key) => {
      formData.append(key, object[key])
    })
    return formData
  }
}
