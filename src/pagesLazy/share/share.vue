<template>
  <view>
    <u-popup v-model="showMoreList" mode="bottom" :border-radius="20" @close="popupClose">
      <q-bar round class="solid-bottom">
        <view class="text-black text-lgg text-bold">更多操作</view>
      </q-bar>
      <view class="mt-sm h230px px">
        <u-grid :col="4" :border="false">
          <u-grid-item>
            <q-icon class="text-green" icon="mdi-link-variant" :size="60" @click="copyLink"></q-icon>
            <view class="grid-text">复制链接</view>
          </u-grid-item>
          <u-grid-item>
            <q-icon class="text-blue" icon="mdi-web" :size="60" @click="openInBrowser"></q-icon>
            <view class="grid-text">浏览器打开</view>
          </u-grid-item>
        </u-grid>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts">
import {
  Vue,
  Component
} from 'vue-property-decorator'
import UniUtils from '@/utils/UniUtils'
import PageUtil from '@/utils/PageUtil'

@Component
export default class WebBrowserVue extends Vue {
  webUrl = ''

  showMoreList = false

  onLoad (params) {
    this.webUrl = params.url
  }

  onReady () {
    this.showMoreList = true
  }

  popupClose () {
    PageUtil.goBack()
  }

  copyLink () {
    UniUtils.copyLink(this.webUrl)
  }

  openInBrowser () {
    // #ifdef APP-PLUS
    plus.runtime.openURL(this.webUrl)
    // #endif
    // #ifdef H5
    window.open(this.webUrl)
    // #endif
  }
}
</script>
