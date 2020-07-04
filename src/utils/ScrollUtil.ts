export default class ScrollUtil {
  static pageBottom = 3000000

  static scrollToBottom () {
    setTimeout(() => {
      uni.pageScrollTo({
        scrollTop: ScrollUtil.pageBottom,
        duration: 0
      })
    }, 100)
  }

  static scrollTo (scrollTop: number) {
    setTimeout(() => {
      uni.pageScrollTo({
        scrollTop: scrollTop,
        duration: 0
      })
    }, 100)
  }
}
