<template>
  <view class="h100r bg-white">
    <city-picker v-model="showSearch" :district="district" @confirm="cityChange"></city-picker>

    <view v-if="showTagSearch">
      <talk-add-tag-search :tags="tags" :is-add="true" :select-tags="selectTags" @change="changeTag"
                           @close="closeTagSearch"
                           @delete-tag="deleteTag" @add-tag="showAddTag">
      </talk-add-tag-search>
    </view>

    <view v-if="showTagAdd">
      <tag-add @change="addTagCheckTag" @close="closeTagAddVue"/>
    </view>
    <view v-show="!showSearch&&!showTagSearch&&!showTagAdd">
      <view class="uni-textarea">
        <textarea class="h140px" :maxlength="200" placeholder="想说啥就说啥，不用再顾虑别人的看法了，放飞自己，享受自由吧"
                  v-model.trim="talkContent"
                  :show-confirm-bar="false"
        />
      </view>
      <view class="uni-list list-pd pb-xs">
        <view class="uni-list-cell cell-pd">
          <view class="uni-uploader">
            <view class="uni-uploader-body">
              <view class="uni-uploader__files">
                <block v-for="(image,index) in showImgUrls" :key="index">
                  <view class="uni-uploader__file position-relative">
                    <view
                        class="close-view position-absolute z-index-button text-black size20 bg-gray bg-half-transparent row-all-center topRight bd-bl-radius"
                        @click="deleteImg(index)">×
                    </view>
                    <image class="uni-uploader__img" mode="aspectFill" :src="image"
                           :data-src="image" @click="previewImage"/>
                  </view>
                </block>
                <view class="uni-uploader__input-box" v-show="showsImgSrcs.length < 3">
                  <view class="uni-uploader__input" @click="chooseImage"/>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="article-bro pt-sm mt-xs row-between">
        <view class="v-tag v-round bg-orange-plain" @click="openSearchVue">
          <q-icon v-if="district.isPosition || !district.adCode" size="28" icon="map-fill"/>
          <block v-if="district.adCode">
            {{district.provinceName}}
            <text v-if="district.cityName">
              -{{district.cityName}}
            </text>
            <text v-if="district.districtName">
              -{{district.districtName}}
            </text>
          </block>
          <text v-else>
            {{district.adName}}
          </text>
        </view>
        <view class="col-center">
          图片数量：{{showsImgSrcs.length}}/{{imgMaxSize}}
        </view>
      </view>
      <view class="article-bro pt-sm">
        <view class="pb-sm">
          已选话题：
        </view>
        <view class="grid">
          <view v-for="tag in selectTags" :key="tag.id" class="row-center pb-10px px-mn">
            <view class="v-tag v-round bg-green-plain">
              <text @click="openTagSearchVue(false)">#{{tag.name}}</text>
              <q-icon v-if="tag.id" class="ml-5px" size="30" icon="close-circle-fill"
                      @click.stop="deleteTag(tag)"/>
            </view>
          </view>
        </view>
        <view class="pb-sm">
          热门话题：
        </view>
        <view class="grid">
          <view v-for="tag in unSelectTags" :key="tag.id" class="row-center pb-10px px-mn">
            <view class="v-block-full v-tag v-round bg-green-plain" @click="checkTag(tag)">
              #{{tag.name}}
            </view>
          </view>
          <view class="row-center pb-10px px-mn">
            <view class="v-block-full v-tag v-round bg-orange-plain" @click="openTagSearchVue(false)">
              更多
              <q-icon size="28" icon="arrow-right" class="ml-5px"/>
            </view>
          </view>
        </view>
      </view>
      <view class="article-bro pt-xs">
        <button type="primary" :disabled="buttonDisabled" @click="addTalk">发布</button>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import TalkAPI from '@/api/TalkAPI'
import PagePath from '@/const/PagePath'
import UniUtils from '@/utils/UniUtils'
import DistrictVO from '@/model/DistrictVO'
import { namespace } from 'vuex-class'
import JsonUtils from '@/utils/JsonUtils'
import DistrictUtil from '@/utils/DistrictUtil'
import TagVO from '@/model/tag/TagVO'
import TagUtil from '@/utils/TagUtil'
import PageUtil from '@/utils/PageUtil'
import ImgUtil from '@/utils/ImgUtil'
import CosConst from '@/const/CosConst'
import UserVO from '@/model/user/UserVO'
import ImgFileVO from '@/model/ImgFileVO'
import CosUtil from '@/utils/CosUtil'
import { appModule } from '@/plugins/store'
import TalkAddTagSearch from '@/pagesLazy/talk/TalkAddTagSearch.vue'
import CityPicker from '@/components/CityPicker.vue'
import TagAdd from '@/pagesLazy/tag/TagAdd.vue'
import PlatformUtils from '@/utils/PlatformUtils'

const userStore = namespace('user')
const appStore = namespace('app')

@Component({
  components: { CityPicker, TalkAddTagSearch, TagAdd }
})
export default class TalkAddVue extends Vue {
  @appStore.State('districts') readonly districts: DistrictVO[]
  @appStore.State('tags') readonly storeTags: TagVO []
  @userStore.State('user') readonly user: UserVO
  district: DistrictVO = null
  talkContent = ''
  showsImgSrcs: ImgFileVO [] = []
  tags: TagVO [] = []
  imgMaxSize = 3
  showSearch = false
  showTagSearch = false
  showTagAdd = false
  buttonDisabled = false

  onLoad () {
    this.tags = JsonUtils.deepClone(this.storeTags)
    DistrictUtil.getCityByIpWebAPI().then((district: DistrictVO) => {
      this.district = district
    }).catch(() => {
      this.district = appModule.district
    })
  }

  onUnload () {
    this.talkContent = ''
    this.showsImgSrcs = []
  }

  get showImgUrls () {
    return this.showsImgSrcs.map((item: any) => item.path)
  }

  openTagSearchVue (query: boolean) {
    if (query || this.tags.length < 11) {
      appModule.getTagsAction()
    }
    this.showTagSearch = true
  }

  get selectTags (): TagVO[] {
    const selectTags = this.tags.filter(item => item.selected)
    if (selectTags.length > 0) {
      return selectTags
    } else {
      return TagUtil.initTagAry
    }
  }

  @Watch('storeTags')
  watchStoreHotTagsChange () {
    const tags = JsonUtils.deepClone(this.storeTags)
    this.selectTags.forEach(item => {
      const tag: TagVO = tags.find(tag => item.id === tag.id)
      if (tag) {
        tag.selected = true
      }
    })
    this.tags = tags
  }

  get unSelectTags (): TagVO[] {
    return this.tags.filter((item, index) => !item.selected && index < 7)
  }

  addTagCheckTag (tag: TagVO) {
    this.closeTagAddVue()
    this.checkTag(tag)
    this.openTagSearchVue(true)
  }

  closeTagAddVue () {
    this.showTagAdd = false
  }

  checkTag (tag: TagVO) {
    if (this.selectTags.length > 4) {
      // todo 后台还没有校验
      UniUtils.info('最多选择5个话题')
      return
    }
    let tagInTags: TagVO = this.tags.find(item => item.id === tag.id)
    if (!tagInTags) {
      this.storeTags.push(tag)
      this.tags.push(tag)
      tagInTags = this.tags.find(item => item.id === tag.id)
    }
    tagInTags.selected = true
  }

  get selectTagIds () {
    return this.selectTags.map(item => item.id)
  }

  changeTag (tag: TagVO) {
    this.checkTag(tag)
    this.closeTagSearch()
  }

  deleteTag (tag: TagVO) {
    const tagInTags: TagVO = this.selectTags.find(item => item.id === tag.id)
    tagInTags.selected = false
  }

  closeTagSearch () {
    this.showTagSearch = false
  }

  showAddTag () {
    this.closeTagSearch()
    this.showTagAdd = true
  }

  openSearchVue () {
    // 如果第二个没有子节点且或者子节点为0
    if (!this.districts[1].childs || !this.districts[1].childs.length) {
      appModule.getDistrictsAction()
    }
    this.showSearch = true
  }

  cityChange (district: DistrictVO) {
    // 如果没使用定位，则使用之前的定位
    this.district = district
  }

  addTalk () {
    this.buttonDisabled = true
    if (this.talkContent || this.showsImgSrcs.length) {
      if (this.talkContent && this.talkContent.length > 200) {
        return UniUtils.hint('动态最多支持200个字，请精简动态内容')
      }
      this.addTalkHandler()
      // 申请订阅
      PlatformUtils.requestSubscribeTalk()
    } else {
      UniUtils.error('不能发布文字和图片均为空的动态')
      this.buttonDisabled = false
    }
  }

  addTalkHandler () {
    uni.showLoading({ title: '发布中' })
    if (this.showsImgSrcs.length === 0) {
      this.publishTalk()
    } else {
      this.uploadImgList()
      this.publishTalk()
    }
  }

  publishTalk () {
    TalkAPI.addTalkAPI(this.talkContent, this.showsImgSrcs, this.district, this.selectTagIds)
      .then(() => {
        this.buttonDisabled = false
        uni.hideLoading()
        PageUtil.reLaunch(PagePath.talk)
      })
      .catch(() => {
        this.buttonDisabled = false
        uni.hideLoading()
      })
  }

  uploadImgList () {
    const cos = CosUtil.getAuthorizationCos()
    for (const imgFile of this.showsImgSrcs) {
      cos.postObject({
        Bucket: CosConst.bucketName,
        Region: CosConst.region,
        Key: imgFile.src,
        FilePath: imgFile.path
      })
    }
  }

  deleteImg (e) {
    this.showsImgSrcs.splice(e, 1)
  }

  /**
   * 图片前台压缩，往后台传一个压缩后的可看清的图，然后后台弄出来一个压缩图，
   */
  async chooseImage () {
    if (this.showsImgSrcs.length >= this.imgMaxSize) {
      const isContinue = await this.isFullImg()
      console.log('是否继续?', isContinue)
      if (!isContinue) {
        return
      }
    }
    uni.chooseImage({
      sourceType: ['album'],
      sizeType: ['original'],
      // sizeType: ['compressed'],
      count: this.imgMaxSize - this.showsImgSrcs.length,
      success: (res) => {
        const imgFiles: any = res.tempFiles
        for (const imgFile of imgFiles) {
          // 不能大于10m大于10m就压缩不到100k
          // 获取压缩比
          const imgSize: number = imgFile.size
          if (imgSize / 1024 / 1024 > 10) {
            UniUtils.error('图片大小不能超过10MB！')
            return
          }
          // 获取文件名
          const filePath = imgFile.path
          imgFile.src = ImgUtil.getTalkUploadFormat(this.user.id, filePath)
          uni.getImageInfo({
            src: filePath,
            success: (image) => {
              imgFile.aspectRatio = image.width / image.height
              this.showsImgSrcs.push(imgFile)
            }
          })
        }
      }
    })
  }

  isFullImg () {
    return new Promise((resolve) => {
      uni.showModal({
        content: '已经有' + this.imgMaxSize + '张图片了,是否清空现有图片？',
        success: (e) => {
          if (e.confirm) {
            this.showsImgSrcs = []
            resolve(true)
          } else {
            resolve(false)
          }
        },
        fail: () => {
          resolve(false)
        }
      })
    })
  }

  previewImage (e) {
    const current = e.target.dataset.src
    uni.previewImage({
      current: current,
      urls: this.showImgUrls
    })
  }
}
</script>
