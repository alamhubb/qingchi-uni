export default class NumberUtil {
  static isAllNumber (val: string): boolean {
    return /^\d+$/.test(val)
  }

  static containNoNumber (val: string): boolean {
    return !NumberUtil.isAllNumber(val)
  }
}
