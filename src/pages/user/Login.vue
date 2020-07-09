<template>
  <view class="bg-white h100r w100vw">
    <view class="px pt-10 pb-10px col-between h100r">
      <!--
      有用户时，百分百显示。绑定手机号时要显示
      或者就是为app时,app没用户登陆时要显示
      -->
      <view class="h460rpx row-center">
        <view v-if="showPhoneView">
          <view v-if="!user" class="u-type-warning-light-bg row-col-center mx px-sm py-xs mb-lg">
            <q-icon size="50" icon="volume-fill" class="u-type-warning"></q-icon>
            <view class="ml text-bold">
              <text class="u-type-primary">建议使用 QQ 或 微信 登陆</text>
              ，一键登陆，无需输入，登陆更便捷，账号不遗忘
            </view>
          </view>
          <view v-else class="mt-lg"></view>
          <view class="cu-form-group divider">
            <view class="title">手机号</view>
            <!--   自动获取焦点的话app平台会有问题，打开我的页面时会弹出键盘   :focus="true"-->
            <input type="number" name="input" :focus="phoneNumFocus" :maxlength="11" v-model.trim="phoneNum"
                   @confirm="authCodeInputFocus"
                   @blur="phoneNumInputBlur" @focus="phoneNumInputFocus"
                   :confirm-hold="true"
            />
            <q-icon v-if="phoneNum" class="text-gray mr-lg" icon="close-circle" size="40"
                    @touchend.native.prevent="phoneNumClear"></q-icon>
            <view class="cu-capsule radius">
              <view class='cu-tag bg-blue '>
                +86
              </view>
              <view class="cu-tag line-blue">
                中国大陆
              </view>
            </view>
          </view>
          <view class="card-text-row text-df h60rpx row-col-center">
            <text v-if="phoneNum && !phoneNumberRight" class="text-red">
              *请输入正确的手机号
            </text>
          </view>
          <view class="cu-form-group divider">
            <view class="title">验证码</view>
            <input type="number" name="input" :focus="authCodeFocus" :maxlength="4" v-model.trim="authCode"
                   @focus="authCodeInputFocus"
                   @blur="authCodeInputBlur"/>
            <q-icon v-if="authCode" class="text-gray mr-lg" icon="close-circle" size="40"
                    @touchend.native.prevent="authCodeClear"></q-icon>
            <view @click="sendCodeClick">
              <button class='cu-btn bg-green w30vw' :disabled="sendAuthCodeBtnDisabled">
                {{countDown? authCodeInterval+1 - countDown:'发送验证码'}}
              </button>
            </view>
          </view>
          <view class="card-text-row text-df h60rpx row-col-center">
            <text v-if="!authCodeRight&&phoneNumberRight" class="text-red">
              *请输入正确的验证码
            </text>
          </view>
        </view>
        <view v-else>
          <image class="radius flex-none size180"
                 src="/static/img/logo.png"
          />
        </view>
      </view>

      <view class="h440rpx">
        <view class="mt-xs px text-bold row-center row-grid">
          <u-checkbox v-model="contractChecked" active-color="#19be6b">
            我已阅读并同意
          </u-checkbox>
          <navigator :url="userAgreementUrl" class="text-blue">
            《用户协议》
          </navigator>
          <navigator :url="userPrivacyUrl" class="text-blue">
            《隐私政策》
          </navigator>
          <navigator :url="childProtectUrl" class="text-blue">
            《儿童个人信息保护规则及监护人须知》
          </navigator>
        </view>

        <view>
          <view v-if="user" class="mt-sm cu-bar bg-white row-around px">
            <button class="cu-btn bd-gray radius w35vw bg-white" @click="cancelBind">暂不绑定</button>
            <view @click="bindPhoneNum">
              <button class="cu-btn bg-orange-plain radius w35vw">
                绑定
              </button>
            </view>
          </view>

          <view v-else>
            <view v-if="!phoneNumFocus && !authCodeFocus" class="mt-xs col-row-center">
              <!-- 只要不为QQ小程序平台都可以使用微信登陆-->
              <button class="bg-gradual-wx text-white text-lgg bd-none  mt-sm bg-active round w80vw" @click="wxLogin">
                <q-icon color="white" icon="weixin-fill" size="36" class="mr-sm"></q-icon>
                微信登陆
              </button>

              <button class="bg-gradual-qq text-white text-lgg bd-none mt bg-active round w80vw" @click="qqLogin">
                <q-icon color="white" icon="qq-fill" size="34" class="mr-sm"></q-icon>
                QQ登陆
              </button>
            </view>
            <view class="mt px">
              <view class="row-center">
                <!--          微信颜色-->
                <view @click="bindPhoneNum" v-if="showPhoneView">
                  <button :disabled="loginButtonDisabled"
                          class="bg-gradual-phone text-white text-lgg bd-none bg-active round w80vw">
                    <q-icon color="white" icon="mdi-cellphone-android" size="34" class="mr-sm"></q-icon>
                    手机号登录
                  </button>
                </view>
                <view v-else class="row-all-center" @click="showPhoneView=!showPhoneView">
                  <view class="q-solids-bottom text-gray">
                    其他登录方式
                  </view>
                  <q-icon class="ml-xs text-gray" icon="arrow-right"></q-icon>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="row-between px-sm">
        <navigator :url="homeUrl" class="text-bold u-type-info q-solids-bottom">
          <q-icon icon="home" size="30" class="mr-xs"></q-icon>
          关于我们
        </navigator>

        <view @click="copyServiceNum" class="text-bold u-type-info q-solids-bottom">
          客服微信、QQ：{{qqService}}
          <q-icon icon="attach" size="30" class="ml-xs"></q-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UserVO from '@/model/user/UserVO'
import { namespace } from 'vuex-class'
import UniUtils from '@/utils/UniUtils'
import NumberUtil from '@/utils/NumberUtil'
import UserAPI from '@/api/UserAPI'
import PageUtil from '@/utils/PageUtil'
import UserStore from '@/plugins/store/UserStore'
import LoginAPI from '@/api/LoginAPI'
import ConfigMap from '@/const/ConfigMap'
import UCheckbox from 'uview-ui/components/u-checkbox/u-checkbox.vue'
import UButton from 'uview-ui/components/u-button/u-button.vue'
import QIcon from '@/components/q-icon/q-icon.vue'
import SkipUrlConst from '@/const/SkipUrlConst'
import ProviderType from '@/const/ProviderType'
import LoginService from '@/pages/user/LoginService'

const userStore = namespace('user')
const configStore = namespace('config')
const systemStore = namespace('system')

@Component({
  components: {
    QIcon, UCheckbox, UButton
  }
})
export default class LoginVue extends Vue {
  @userStore.State('user') user: UserVO
  @configStore.Getter(ConfigMap.authCodeIntervalKey) authCodeInterval: number
  @configStore.Getter(ConfigMap.qqServiceKey) qqService: string
  @systemStore.State('isMp') isMp: boolean

  phoneNum = ''
  authCode = ''
  countDown = 0
  bindBtnDisabled = false
  qqLoginEnable = true

  showPhoneView = false

  created () {
    if (this.user) {
      this.showPhoneView = true
    }
  }

  qqLogin () {
    this.providerLogin(ProviderType.qq)
  }

  wxLogin () {
    this.providerLogin(ProviderType.wx)
  }

  providerLogin (providerType) {
    if (this.qqLoginEnable) {
      this.qqLoginEnable = false
      LoginService.platformLogin(providerType).finally(() => {
        this.qqLoginEnable = true
      })
    }
  }

  get homeUrl (): string {
    return SkipUrlConst.homeUrl()
  }

  get userAgreementUrl (): string {
    return SkipUrlConst.userAgreementUrl()
  }

  get userPrivacyUrl (): string {
    return SkipUrlConst.userPrivacyUrl()
  }

  get childProtectUrl (): string {
    return SkipUrlConst.childProtectUrl()
  }

  //同意协议
  contractChecked = true

  phoneNumClear () {
    this.phoneNum = ''
    UniUtils.delayTime(100).then(() => {
      this.phoneNumInputFocus()
    })
  }

  authCodeClear () {
    this.authCode = ''
    UniUtils.delayTime(100).then(() => {
      this.authCodeInputFocus()
    })
  }

  get loginButtonDisabled () {
    return !this.contractChecked || !this.phoneNumberRight || !this.authCodeRight || this.bindBtnDisabled
  }

  copyServiceNum () {
    UniUtils.textCopy('491369310', '客服联系方式已复制')
  }

  sendCodeClick () {
    if (!this.phoneNumberRight) {
      return UniUtils.toast('请输入正确的手机号')
    }
    if (this.countDown) {
      return UniUtils.toast('验证码发送频繁，请等待')
    }

    this.countDown++
    const Timer = setInterval(() => {
      if (this.countDown === this.authCodeInterval) {
        clearInterval(Timer)
        this.countDown = 0
        return
      }
      this.countDown++
    }, 1000)
    // 如果怕太频繁，就显示相同手机号每天只能发送几次，一小时内只能5次
    UserAPI.sendAuthCodeAPI(this.phoneNum).then(() => {
      // 提示验证码发送成功
      UniUtils.toast('验证码发送成功')
    })
  }


  authCodeFocus = false
  phoneNumFocus = false

  phoneNumInputFocus () {
    this.phoneNumFocus = true
  }

  phoneNumInputBlur () {
    this.phoneNumFocus = false
  }

  authCodeInputFocus () {
    this.authCodeFocus = true
  }

  authCodeInputBlur () {
    this.authCodeFocus = false
  }

  get sendAuthCodeBtnDisabled () {
    return !this.phoneNumberRight || Boolean(this.countDown)
  }

  get authCodeRight () {
    return this.authCode && this.authCode.length === 4 && NumberUtil.isAllNumber(this.authCode)
  }

  get phoneNumberRight () {
    return this.phoneNum && this.phoneNum.length === 11 && NumberUtil.isAllNumber(this.phoneNum)
  }

  cancelBind () {
    // 回上一页
    PageUtil.goBack()
  }

  bindPhoneNum () {
    //再次校验
    if (!this.phoneNumberRight) {
      return UniUtils.toast('请输入正确的手机号')
    }
    if (!this.authCodeRight) {
      return UniUtils.toast('请输入正确的验证码')
    }
    if (!this.contractChecked) {
      return UniUtils.hint('请仔细阅读用户协议、隐私政策等内容后勾选同意')
    }
    if (!this.bindBtnDisabled) {
      this.bindBtnDisabled = true
      if (this.user) {
        UserAPI.bindPhoneNumAPI(this.phoneNum, this.authCode).then((res: any) => {
          UserStore.setMineUser(res.data)
          // 提示验证码发送成功
          UniUtils.hint('绑定成功').finally(() => {
            PageUtil.toMinePage()
          })
        }).finally(() => {
          this.bindBtnDisabled = false
        })
      } else {
        LoginAPI.nmpAppLoginAPI(this.phoneNum, this.authCode).then(() => {
          // 提示验证码发送成功
          UniUtils.hint('登录成功')
        }).finally(() => {
          this.bindBtnDisabled = false
        })
      }
    }
  }
}
</script>
