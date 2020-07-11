import PagePath from '../const/PagePath'
import store, { chatModule, configModule, systemModule, userModule } from '@/plugins/store'
import UniUtils from '@/utils/UniUtils'
import UserVO from '@/model/user/UserVO'
import ChatVO from '@/model/chat/ChatVO'
import BalaBala from '@/utils/BalaBala'
import SkipUtil from '@/utils/SkipUtil'
import SkipType from '@/const/SkipType'
import SkipUrlConst from '@/const/SkipUrlConst'
import HintMsg from '@/const/HintMsg'

export default class MsgUtil {
  static iosDisablePay () {
    return UniUtils.hint(HintMsg.iosDisablePayMsg)
  }

  static notMpDisablePay () {
    return UniUtils.hint(HintMsg.notMpDisablePayMsg)
  }

  static payFailMsg () {
    return UniUtils.hint(HintMsg.payFailMsg)
  }

  static sysErrMsg () {
    return UniUtils.hint(configModule.systemError604)
  }
}
