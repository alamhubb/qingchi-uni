import { configModule, userModule } from '@/plugins/store'
import PageUtil from '@/utils/PageUtil'
import UserVO from '@/model/user/UserVO'
import UniUtils from '@/utils/UniUtils'

export default class BalaBala {
  static unBindPhoneNum () {
    const user: UserVO = userModule.user
    if (!user) {
      BalaBala.unLoginMessage()
    } else {
      // 如果登陆了仅仅没绑定手机号，则提示跳转，区分qq和微信不同
      UniUtils.action('绑定手机号才能发布内容，是否跳转至绑定手机号页面')
        .then(() => {
          // #ifdef MP-WEIXIN
          PageUtil.toMinePage()
          // #endif
          // #ifndef MP-WEIXIN
          PageUtil.toPhonePage()
          // #endif
        })
    }
  }

  static unLoginMessage () {
    UniUtils.info(configModule.systemError601)
      .then(() => {
        // 没token才执行登录,有token证明已经登录，如果有错误应该清空token在执行这个
        PageUtil.toMinePage()
      })
  }

  static systemErrorMsg () {
    UniUtils.error(configModule.systemError604)
  }

  static unUploadImg () {
    UniUtils.action('请完善用户信息绑定手机号并上传照片，才能进行此项操作，是否前往完善信息', '前往').then(() => {
      PageUtil.toMinePage()
    })
  }

  static unIdentityAuth () {
    UniUtils.action('请对照片进行认证，才能进行此项操作', '前往认证').then(() => {
      PageUtil.toMinePage()
    })
  }
}
