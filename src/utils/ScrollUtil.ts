import UniUtil from '@/utils/UniUtil'
import { Vue } from 'vue-property-decorator'

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
    /*Vue.nextTick(() => {
      uni.pageScrollTo({
        scrollTop: scrollTop,
        duration: 0
      })
    })*/
    UniUtil.delayTime(100).then(() => {
      uni.pageScrollTo({
        scrollTop: scrollTop,
        duration: 0
      })
    })
  }
}
