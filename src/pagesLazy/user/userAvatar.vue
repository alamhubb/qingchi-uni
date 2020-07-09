<template>
  <view class="h100vh bg-white">
    <image :src="avatarUrl" class="size100vw"></image>

    <view class="cu-bar btn-group bg-white flex-none pt-5px mt-20px">
      <button class="cu-btn bd-gray radius lg" @click="cancelClick">
        取消
      </button>
      <button class="cu-btn bd-blue radius lg" @click="chooseImg">
        上传
      </button>
    </view>

    <view class="row-center mt-20px">
      <button class="w94vw cu-btn bg-green radius lg" :disabled="buttonDisabled" @click="saveAvatar">
        保存
      </button>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import UserVO from '@/model/user/UserVO'
import { namespace } from 'vuex-class'
import ImgUtil from '@/utils/ImgUtil'
import UniUtils from '@/utils/UniUtils'
import CosConst from '@/const/CosConst'

import JsonUtils from '@/utils/JsonUtils'
import ImgFileVO from '@/model/ImgFileVO'
import CosUtil from '@/utils/CosUtil'
import PageUtil from '@/utils/PageUtil'
import UserStore from '@/plugins/store/UserStore'
import UserAPI from '@/api/UserAPI'
import HintMsg from '@/const/HintMsg'

const userStore = namespace('user')

@Component
export default class UserAvatarVue extends Vue {
  @userStore.State('user') user: UserVO

  saveDisabled = false
  uploadImgFile: ImgFileVO = null
  showBottomDialog = true
  avatarUrl = ''

  onLoad () {
    if (this.user) {
      this.avatarUrl = this.user.avatar
    }
  }

  @Watch('user')
  watchUserChange () {
    this.avatarUrl = this.user.avatar
  }

  get buttonDisabled (): boolean {
    return !this.uploadImgFile || this.saveDisabled
  }

  cancelClick () {
    PageUtil.toMinePage()
  }

  chooseImg () {
    this.showBottomDialog = false
    uni.chooseImage({
      sourceType: ['album'],
      sizeType: ['original'],
      // sizeType: ['compressed'],
      count: 1,
      success: (res) => {
        const imgFile: ImgFileVO = new ImgFileVO(res.tempFiles[0])
        // 不能大于10m大于10m就压缩不到100k
        // 获取压缩比
        const imgSize: number = imgFile.size
        if (imgSize / 1024 / 1024 > 10) {
          UniUtils.error('图片大小不能超过10MB！')
          return
        }
        // 获取文件名
        const filePath = imgFile.path
        imgFile.src = ImgUtil.getUserAvatarUploadFormat(this.user.id, filePath)
        this.uploadImgFile = imgFile
        this.avatarUrl = imgFile.path
      }
    })
  }

  saveAvatar () {
    this.saveDisabled = true
    UniUtils.showLoading('保存中')
    // 更新之后提示是否跳转信息页，更新手需要更新用户信息
    let ratio = 100
    // 300k+ 3116151b
    const imgSize: number = this.uploadImgFile.size
    // 如果大于100k 按照100k标准压缩
    if (imgSize > 100 * 1024) {
      // 得出来100以下的压缩比
      ratio = Math.round(10000 / (imgSize / 1024))
    }
    uni.compressImage({
      src: this.uploadImgFile.path,
      quality: ratio,
      success: res => {
        this.uploadImgFile.path = res.tempFilePath
        CosUtil.postObject(this.uploadImgFile).then((data) => {
          const newAvatar = data.Location
          const userCopy: UserVO = JsonUtils.deepClone(this.user)
          userCopy.avatar = 'https://' + newAvatar
          UserStore.setMineUser(userCopy)
          UserAPI.updateAvatarAPI(newAvatar)
          UniUtils.action('保存完成，是否跳转至个人详情页', '跳转').then(() => {
            PageUtil.toMinePage()
          })
        }).finally(() => {
          this.saveDisabled = false
          this.uploadImgFile = null
          UniUtils.hideLoading()
        })
      }
    })
  }
}
</script>
