<template>
  <view>
    <text class="card-text" @click="toTalkDetailVue" selectable>
      {{talk.content}}
    </text>
    <view v-if="talk.imgs.length" class="card-text-row mt-10px" @click="toTalkDetailVue">
      <image mode="aspectFill" class="card-text-img" v-for="(img,index) in talk.imgs.slice(0,3)" :key="img.id"
             :style="{'max-width':talk.imgs.length===1?Math.min(200*img.aspectRatio,230)+'px':'','max-height':talk.imgs.length===1?'200px':668/Math.min(talk.imgs.length,3)+'rpx'}"
             :src="getTalkSmallImgUrl(talk.user.id,img.src)"
             :show-menu-by-longpress="true"
             @click.stop="previewImage(index)"
      ></image>
    </view>
    <view v-if="talk.tags&&talk.tags.length && !talk.globalTop || talk.globalTop===1" class="card-text-row grid"
          @click="toTalkDetailVue">
      <view v-for="tag in talk.tags" :key="tag.id"
            class="cu-tag round bg-green-plain mt-10px">
        #{{tag.name}}
      </view>
    </view>
    <view v-if="!talk.globalTop || talk.globalTop===1" class="card-text-row pt-10px" @click="toTalkDetailVue">
      <view class="cu-tag round bg-orange light">
        <q-icon size="26" icon="map-fill"></q-icon>
        {{talk.district.provinceName}}
        <text v-if="talk.district.cityName">-{{talk.district.cityName}}</text>
        <text v-if="talk.district.districtName">-{{talk.district.districtName}}</text>
      </view>
      <view v-if="talk.distance|| talk.distance===0" class="cu-tag round bg-orange light">
        <text v-if="talk.distance<0.5">距离 &lt; {{0.5}}公里</text>
        <text v-else-if="talk.distance<1">距离 &lt; {{1}}公里</text>
        <text v-else-if="talk.distance<5">距离 &lt; {{5}}公里</text>
        <text v-else>距离{{talk.distance | numFixed1}}公里</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import TalkVO from '@/model/talk/TalkVO'
import PagePath from '@/const/PagePath'
import ImgUtil from '@/utils/ImgUtil'
import PageUtil from '@/utils/PageUtil'

@Component
export default class TalkItemContent extends Vue {
  @Prop() talk: TalkVO

  toTalkDetailVue () {
    if (PageUtil.getCurrentPageURI() !== PagePath.talkDetail) {
      PageUtil.navigateTo(PagePath.talkDetail + '?talkId=' + this.talk.id)
    }
  }

  getTalkLargeImgUrl (userId: number, src: string) {
    return ImgUtil.getTalkLargeImgUrl(userId, src)
  }

  getTalkSmallImgUrl (userId: number, src: string) {
    return ImgUtil.getTalkSmallImgUrl(userId, src)
  }

  /* previewImage(e) {
    const current = e.target.dataset.src
    uni.previewImage({
      current: current,
      urls: this.showsImgSrcs
    })
  } */

  previewImage (index) {
    uni.previewImage({
      current: index,
      urls: this.talk.imgs.map(item => this.getTalkLargeImgUrl(this.talk.user.id, item.src))
    })
  }
}
</script>
