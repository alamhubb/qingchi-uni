export default class TalkUtil {
  static getHugIcon (hasHugged: boolean): string {
    if (hasHugged) {
      return 'heart-fill'
    } else {
      return 'heart'
    }
  }

  static getHugColor (hasHugged: boolean): string[] {
    if (hasHugged) {
      return ['red', 'darken-1']
    } else {
      return []
    }
  }
}
