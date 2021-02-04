<template>
  <view>
    <!--  #ifndef MP -->
    <u-navbar>
      <view class="row-between w100r flex-auto">
        <view class="ml-xl text-bold text-lg">
          {{ title }}
        </view>
        <view class="pr pl-xl" @click="showShare">
          <q-icon icon="more-dot-fill" size="50"></q-icon>
        </view>
      </view>
    </u-navbar>
    <!--  #endif -->

    <web-view :src="webUrl"></web-view>
  </view>
</template>

<script lang="ts">
import {
  Vue,
  Component
} from 'vue-property-decorator'
import PageUtil from '@/utils/PageUtil'
import PagePath from '@/const/PagePath'
import { namespace } from 'vuex-class'
import { systemModule } from '@/plugins/store'

const systemStore = namespace('system')

@Component
export default class WebBrowserVue extends Vue {
  @systemStore.State('titleHeight') titleHeight

  webUrl = ''
  title = '网页'

  public $scope!: {
    $getAppWebview: any;
  }

  onLoad (params) {
    this.webUrl = 'https://mp.qingchiapp.com'
    /*this.webUrl = decodeURIComponent(params.url)
    const title: string = params.title
    if (title) {
      this.title = title
      uni.setNavigationBarTitle({
        title: title
      })
    }*/
  }

  onReady () {
    /*if (systemModule.isMp) {
      UniUtils.copyLink(this.webUrl)
    }*/
    // #ifdef APP-PLUS
    //ios情况下，赋值比获取快，所以需要在mounted里面赋值
    const currentWebview = this.$scope.$getAppWebview()
    const wv = currentWebview.children()[0]
    const height = systemModule.contentHeight
    wv.setStyle({ top: this.titleHeight, height: height })
    // #endif
  }

  showShare () {
    PageUtil.navigateTo(PagePath.share, { url: this.webUrl })
  }
}
</script>
