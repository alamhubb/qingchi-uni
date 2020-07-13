import { configModule } from '@/plugins/store'
import UniUtil from './UniUtil'

import HintMsg from '@/const/HintMsg'

export default class MsgUtil {
  static iosDisablePay () {
    return UniUtil.hint(HintMsg.iosDisablePayMsg)
  }

  static notMpDisablePay () {
    return UniUtil.hint(HintMsg.notMpDisablePayMsg)
  }

  static payFailMsg () {
    return UniUtil.hint(HintMsg.payFailMsg)
  }

  static sysErrMsg () {
    return UniUtil.hint(configModule.systemError604)
  }
}
