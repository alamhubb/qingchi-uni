<template>
  <view class="bg-white">
    <view v-if="user.isSelfAuth" class="article-row">
      <view class="text-xxl text-red">您已认证通过，无需重复认证</view>
    </view>
    <view v-else-if="user.authNum>2" class="article-row">
      <view class="text-xxl text-red">您已达到认证次数上限，请联系客服处理</view>
    </view>
    <view v-else>
      <view class="article">
        <view class="text-xl">
          1.您在个人信息页面上传的照片必须为本人照片，才能通过身份认证，认证次数有限，请上传真实自拍认证
        </view>
        <view class="text-xl">
          2.点击开始自拍，拍摄本人照片后，点击认证，即可完成认证
        </view>
        <view class="text-xl">
          3.本次拍摄照片仅用于本人照片认证，不会向任何人展示
        </view>
      </view>

      <view class="cu-bar btn-group bg-white mt-20px">
        <button class="cu-btn bg-green radius lg" @click="chooseImg">
          开始自拍
        </button>
        <button class="cu-btn bg-blue radius lg" @click="identityAuth" :disabled="!imgFile || authBtnDisabled">
          认证
        </button>
      </view>

      <image v-if="imgFile" class="size100vw"
             mode="aspectFit"
             :src="imgFile.path"
      ></image>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TalkItem from '@/pages/talk/TalkItem.vue'
import UserVO from '@/model/user/UserVO'
import TalkItemContent from '@/pages/talk/TalkItemContent.vue'
import { namespace } from 'vuex-class'
import UserEdit from '@/pages/user/UserEdit.vue'
import UserInfo from '@/pages/user/UserInfo.vue'
import UniUtil from '@/utils/UniUtil'
import UserStore from '@/plugins/store/UserStore'
import UserAPI from '@/api/UserAPI'
import ImgFileVO from '@/model/ImgFileVO'
import CosUtil from '@/utils/CosUtil'
import ImgUtil from '@/utils/ImgUtil'
import CosConst from '@/const/CosConst'
import PageUtil from '@/utils/PageUtil'
import HintMsg from '@/const/HintMsg'

const userStore = namespace('user')

@Component({
  components: { UserInfo, UserEdit, TalkItem, TalkItemContent }
})
export default class IdentityAuthVue extends Vue {
  @userStore.State('user') user: UserVO
  imgFile: ImgFileVO = null
  authBtnDisabled = false

  chooseImg () {
    // 校验用户必须上传了照片，
    uni.chooseImage({
      sourceType: ['camera'],
      sizeType: ['original'],
      // sizeType: ['compressed'],
      count: 1,
      success: (res) => {
        this.imgFile = new ImgFileVO(res.tempFiles[0])
        // user/id/talk/24324.img
        this.imgFile.src = ImgUtil.getUserIdentityUploadFormat(this.user.id, this.imgFile.path)
      }
    })
  }

  identityAuth () {
    this.authBtnDisabled = true
    UniUtil.showLoading('认证中')
    // 校验用户必须上传了照片，
    CosUtil.postObject(this.imgFile).then(() => {
      this.user.authNum = this.user.authNum + 1
      UserAPI.identityAuthAPI(this.imgFile).then((res: any) => {
        UserStore.setMineUser(res.data)
        UniUtil.action(HintMsg.identityAuthSuccessMsg).then(() => {
          PageUtil.toMinePage()
        })
      }).finally(() => {
        UniUtil.hideLoading()
        this.authBtnDisabled = false
      })
    }).catch(() => {
      this.authBtnDisabled = false
    })
  }
}
</script>
