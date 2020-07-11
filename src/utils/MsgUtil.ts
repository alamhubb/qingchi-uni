import PagePath from '../const/PagePath'
import store, { chatModule, configModule, systemModule, userModule } from '@/plugins/store'
import UniUtil from './UniUtil'
import UserVO from '@/model/user/UserVO'
import ChatVO from '@/model/chat/ChatVO'
import BalaBala from '@/utils/BalaBala'
import SkipUtil from '@/utils/SkipUtil'
import SkipType from '@/const/SkipType'
import SkipUrlConst from '@/const/SkipUrlConst'
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
