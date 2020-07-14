import { appModule, chatModule, platformModule, talkModule, userModule } from './index'
import UserVO from '@/model/user/UserVO'
import UserAPI from '@/api/UserAPI'
import ResultVO from '@/model/ResultVO'
import WebsocketUtil from '@/utils/WebsocketUtil'
import TokenUtil from '@/utils/TokenUtil'
import UniUtil from '@/utils/UniUtil'
import AppInitDataVO from '@/model/common/AppInitDataVO'
import TalkFilterUtil from '@/utils/TalkFilterUtil'

export default class UserStore {
  static hasUser (): boolean {
    return !!userModule.user
  }

  static setMineUser (user: UserVO) {
    userModule.user = user
  }

  static async getMineUserAction () {
    return UserAPI.getMineUserInfoAPI().then((res: any) => {
      UserStore.setMineUser(res.data)
      return res
    })
  }

  static initUserStore (res: ResultVO<AppInitDataVO>) {
    const user = res.data.user
    // 如果存在用户
    if (user) {
      //首次登陆且用户有年龄,默认设置筛选上下5岁的用户
      if (!TalkFilterUtil.getNotFirstSetAge() && user.age) {
        const minAge = user.age - 5
        const maxAge = user.age + 5
        talkModule.userMinAge = minAge
        talkModule.userMaxAge = maxAge
        TalkFilterUtil.setFistSetUserAge(minAge, maxAge)
      }
      appModule.notifies = res.data.notifies
      UserStore.setMineUser(res.data.user)
      // 所有操作都是登陆后才可以操作的
      platformModule.qq_talkTemplateId = res.data.qq_talkTemplateId
      platformModule.qq_commentTemplateId = res.data.qq_commentTemplateId
      platformModule.qq_reportResultTemplateId = res.data.qq_reportResultTemplateId
      platformModule.qq_violationTemplateId = res.data.qq_violationTemplateId

      platformModule.wx_talkTemplateId = res.data.wx_talkTemplateId
      platformModule.wx_commentTemplateId = res.data.wx_commentTemplateId
      platformModule.wx_reportResultTemplateId = res.data.wx_reportResultTemplateId
      platformModule.wx_violationTemplateId = res.data.wx_violationTemplateId
    }
    chatModule.setChatsAction(res.data.chats)
  }

  static loginAfter (res: ResultVO<any>) {
    // 设置token
    TokenUtil.set(res.data.tokenCode)
    WebsocketUtil.websocketClose()
    UserStore.initUserStore(res)
  }

  static loginOut () {
    return UniUtil.action('是否退出登录').then(() => {
      TokenUtil.remove()
      WebsocketUtil.websocketClose()
      UserStore.setMineUser(null)
      chatModule.getChatsAction()
      //没必要重设地理位置吧
      // DistrictUtil.重设地理位(DistrictUtil.initDistrict)
      UniUtil.toast('用户退出')
    })
  }
}
