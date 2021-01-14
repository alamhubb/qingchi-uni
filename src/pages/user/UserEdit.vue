<template>
  <view v-if="user" class="cu-dialog flex-col">
    <view class="bg-white row-all-center text-lg pt-sm text-bold">编辑个人信息</view>
    <view class="pt-0 bg-white solid-bottom flex-auto overflow-auto">
      <view>
        <view class="cu-form-group">
          <view class="title">
            昵称
          </view>
          <input :cursor-spacing="20" placeholder="昵称" maxlength="6" v-model.trim="nickname"/>
          <view class="uni-icon uni-icon-clear" v-if="nickname" @click="clearNickname"></view>
        </view>

        <view class="cu-form-group">
          <view class="title">性别</view>
          <view>
            <radio-group @change="genderChange">
              <label class="mr-sm">
                <radio class='blue cuIcon-male' :class="gender=='男'?'checked':''"
                       :checked="gender=='男'?true:false" value="男"></radio>
                <text class="ml-5px">男</text>
              </label>

              <label>
                <radio class='pink cuIcon-female' :class="gender=='女'?'checked':''"
                       :checked="gender=='女'?true:false" value="女"></radio>
                <text class="ml-5px">女</text>
              </label>
            </radio-group>
          </view>
        </view>

        <view class="cu-form-group">
          <view class="title">出生日期</view>
          <picker mode="date" :value="birthday" start="1900-01-01" :end="endDate" @change="dateChange">
            <view class="picker">
              {{ birthday }}
            </view>
          </picker>
        </view>

        <view class="cu-form-group">
          <view class="title">
            所在地
          </view>
          <input :cursor-spacing="20" v-model="location" maxlength="10" placeholder="所在地"/>
          <view class="uni-icon uni-icon-clear" v-if="location" @click="clearLocation"></view>
        </view>

        <!--        todo qq不支持联系方式，改为判断qq一件加好友-->
        <!--        <view class="cu-form-group">
                  <view class="title">
                    联系方式
                  </view>
                  <input :cursor-spacing="20" v-model="contactAccount" maxlength="30" placeholder="例如：vx:491369310"/>
                  <view class="uni-icon uni-icon-clear" v-if="contactAccount" @click="clearContactAccount"></view>
                </view>-->
        <!--<view class="cu-form-group margin-top">
            <view class="title">
                个人介绍
            </view>
            <input placeholder="两字短标题" name="input"></input>
            &lt;!&ndash;                展开下拉，可以显示 兴趣爱好职业收入等等，可自定义&ndash;&gt;
        </view>

        <view class="cu-form-group margin-top">
            <view class="title">
                理想型
                &lt;!&ndash;                    同个人介绍相似&ndash;&gt;
            </view>
            <input placeholder="两字短标题" name="input"></input>
        </view>

        <view class="cu-form-group margin-top">
            <view class="title">
                微信
                <q-icon icon="mdi-wechat"></q-icon>
            </view>
            <input placeholder="两字短标题" name="input"></input>
        </view>
        <view class="cu-form-group">
            <view class="title">
                QQ
                <q-icon icon="mdi-qqchat"></q-icon>
            </view>
            <input placeholder="三字标题" name="input"></input>
        </view>

        <view class="cu-form-group">
            <view class="title">
                微博
                <q-icon icon="mdi-sina-weibo"></q-icon>
            </view>
            <input placeholder="三字标题" name="input"></input>
        </view>
        -->
      </view>
    </view>
    <view class="cu-bar btn-group bg-white flex-none pt-5px pb-sm">
      <button class="cu-btn bd-gray radius bg-white" @click="closeUserEditPop">取消</button>
      <button class="cu-btn bg-green radius" @click="saveUser" :disabled="btnDisabled">保存</button>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Watch, Emit } from 'vue-property-decorator'
import UserVO from '@/model/user/UserVO'
import UserAPI from '@/api/UserAPI'
import { namespace } from 'vuex-class'
import UniUtil from '@/utils/UniUtil'
import UserStore from '@/plugins/store/UserStore'
import { parseDate } from '@/utils'
import JsonUtils from '@/utils/JsonUtils'

const userStore = namespace('user')

@Component
export default class UserEdit extends Vue {
  @userStore.State('user') user: UserVO
  nickname = ''
  gender = '女'
  birthday = '1999-01-01'
  location = ''
  wxAccount = ''
  contactAccount = ''
  qqAccount = ''
  wbAccount = ''
  endDate = ''
  btnDisabled = false

  created () {
    this.endDate = parseDate(new Date())
    this.initData()
  }

  initData () {
    if (this.user) {
      this.nickname = this.user.nickname || ''
      this.gender = this.user.gender || '女'
      this.birthday = this.user.birthday || '1999-01-01'
      this.location = this.user.location || ''
      this.contactAccount = this.user.contactAccount || ''
      this.wxAccount = this.user.wxAccount || ''
      this.qqAccount = this.user.qqAccount || ''
      this.wbAccount = this.user.wbAccount || ''
      this.btnDisabled = false
    }
  }

  @Watch('user')
  watchUserChange () {
    this.initData()
  }

  @Emit('close')
  closeUserEditPop () {
    return ''
  }

  clearNickname () {
    this.nickname = ''
  }

  clearLocation () {
    this.location = ''
  }

  clearWxAccount () {
    this.wxAccount = ''
  }

  clearContactAccount () {
    this.contactAccount = ''
  }

  clearQqAccount () {
    this.qqAccount = ''
  }

  clearWbAccount () {
    this.wbAccount = ''
  }

  saveUser () {
    if (this.contactAccount) {
      if (this.contactAccount.length > 30) {
        UniUtil.hint('联系方式不能超过30个字符，例如：vx:491369310')
        return
      } else if (this.contactAccount.length < 5) {
        UniUtil.hint('联系方式必须大于4个字符，例如：vx:491369310')
        return
      }
    }
    this.btnDisabled = true
    UniUtil.action('是否确定修改个人信息').then(() => {
      const userCopy = JsonUtils.deepClone(this.user)
      userCopy.nickname = this.nickname
      userCopy.gender = this.gender
      userCopy.birthday = this.birthday
      userCopy.location = this.location
      userCopy.contactAccount = this.contactAccount
      userCopy.wxAccount = this.wxAccount
      userCopy.qqAccount = this.qqAccount
      userCopy.wbAccount = this.wbAccount
      UserAPI.editUserAPI(userCopy).then((res: any) => {
        UserStore.setMineUser(res.data)
        UniUtil.toast('已修改')
        this.closeUserEditPop()
      }).finally(() => {
        this.btnDisabled = false
      })
    }).catch(() => {
      this.closeUserEditPop()
      this.btnDisabled = false
    })
  }

  dateChange ({ target }) {
    this.birthday = target.value
  }

  genderChange ({ target }) {
    this.gender = target.value
  }
}
</script>
