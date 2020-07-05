<template>
  <view v-if="talkTabs.length" class="flex-col h100r bg-default">
    <q-row-bar :class="tabsId">
      <q-tabs :tabs="talkTabs" v-model="current" @input="tabsChange">
        <template #default="{tab}">
          <q-tab>
            {{ tab.name }}
          </q-tab>
        </template>
        <template #icon="{tab}">
          <q-icon class="px-xs" v-if="tab.type==='city'" icon="arrow-down"></q-icon>
        </template>
      </q-tabs>
      <view class="flex-row mr-60px" @click="queryEnd(true)" hover-class="uni-list-cell-hover">
        <view v-if="talkTabObj.loadMore===loading">
          <u-loading mode="circle"></u-loading>
        </view>
        <q-icon v-else class="pt-mn" icon="reload" size="36"></q-icon>
      </view>
      <!--<view class="px-sm">
        <view class="w24rpx"></view>
      </view>-->
    </q-row-bar>

    <city-picker v-model="showCityPopup" :district="district" @confirm="cityChange"></city-picker>

    <talk-operate @deleteTalk="deleteTalk"></talk-operate>

    <!--            从附近哪里选择城市-->
    <!--            搜索栏左边加个筛选按钮可以筛选性别年龄-->
    <!--            除去搜索栏和导航栏的高度就是剩余高度-->

    <!--        默认附近，可以切换城市，城市-->
    <view
        :style="{
              'height':'calc(100vh - '+talksListHeightSub+'px)',
              'padding-bottom': talksListPaddingBottom+'px',
            }"
    >
      <swiper class="flex-none h100r bg-default" :current="swiperCurrent"
              @change="talkSwiperChange">
        <swiper-item v-for="(item, swiperIndex) in talkTabs" :key="swiperIndex">
          <scroll-view class="h100r bg-default" :scroll-y="scrollEnable" @scrolltolower="onreachBottom"
                       :lower-threshold="800"
                       @scroll="talksScrollEvent">
            <view v-if="talkTabs[swiperIndex].talks.length || talkTabs[swiperIndex].type !== 'follow'">
              <view v-for="(talk,index) in talkTabs[swiperIndex].talks" :key="talk.id">
                <talk-item
                    :talk="talk"
                    :talk-tab-type="talkTabObj.type"
                    @deleteTalk="deleteTalk"
                />
                <!-- app端广告有问题-->
                <!--  #ifdef APP-PLUS -->
                <!--<view v-if="showAd&&showAdIndexList.includes(index)" class="mb-5px">
                  <ad class="bg-white" adpid="1890536227"></ad>
                </view>-->
                <!--  #endif -->
                <!--wx平台显示的广告-->
                <!--  #ifdef MP-WEIXIN -->
                <ad v-if="showAd&&showAdIndexList.includes(index)"
                    class="bg-white mb-5px" unit-id="adunit-65c8911d279d228f" ad-type="video" ad-theme="white"></ad>
                <!--  #endif -->

                <!--qq平台显示的广告-->
                <!--  #ifdef MP-QQ -->
                <ad v-if="showAd&&showAdIndexList.includes(index)"
                    class="bg-white mb-5px" unit-id="bcc21923107071ac3f8aa076c7e00229" type="card"></ad>
                <!--  #endif -->

                <!--头条平台显示的广告-->
                <!--  #ifdef MP-TOUTIAO -->
                <ad v-if="showAd&&showAdIndexList.includes(index)"
                    class="bg-white mb-5px" type="banner video large" unit-id="3snract0gqnc3fn16d"></ad>
                <!--  #endif -->
              </view>
              <!-- 下拉刷新组件 -->
              <view class="mt-xs">
                <uni-load-more :status="talkTabs[swiperIndex].loadMore" @click.native="queryEnd"
                               :contentText="loadMoreText"></uni-load-more>
              </view>
            </view>
            <view v-else>
              <view v-if="user" class="row-center h500px pt-100px text-bold text-gray text-lg">
                您还没有关注其他人
              </view>
              <view v-else class="row-center h500px pt-100px text-bold text-gray text-lg" @click="toLoginVue">
                您还没有登录，点击登陆
              </view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  Watch
} from 'vue-property-decorator'
import TalkVO from '@/model/talk/TalkVO'
import TalkAPI from '@/api/TalkAPI'
import UserVO from '@/model/user/UserVO'

import TalkItem from '@/pages/talk/TalkItem.vue'
import { namespace } from 'vuex-class'
import LoadMoreType from '@/const/LoadMoreType'
import DistrictVO from '@/model/DistrictVO'
import DistrictUtil from '@/utils/DistrictUtil'
import Constants from '@/const/Constant'
import StorageUtil from '@/utils/StorageUtil'
import TalkVueUtil from '@/utils/TalkVueUtil'
import TalkTabVO from '@/model/talk/TalkTabVO'
import UniUtils from '@/utils/UniUtils'
import TalkSwipers from '@/pages/talk/talkSwipers.vue'
import { appModule, systemModule, talkModule } from '@/plugins/store'
import TalkOperate from '@/pages/talk/talkOperate.vue'
import QTab from '@/components/q-tab/q-tab.vue'
import QTabs from '@/components/q-tabs/q-tabs.vue'
import QIcon from '@/components/q-icon/q-icon.vue'
import CityPicker from '@/components/CityPicker.vue'
import SelectorQuery = UniApp.SelectorQuery
import NodesRef = UniApp.NodesRef
import TalkTabType from '@/const/TalkTabType'
import PageUtil from '@/utils/PageUtil'

const userStore = namespace('user')
const appStore = namespace('app')
const configStore = namespace('config')
const talkStore = namespace('talk')

// todo 后台可控制是否显示轮播图

@Component({
  components: {
    CityPicker,
    QIcon,
    QTabs,
    QTab,
    TalkOperate,
    TalkSwipers,
    TalkItem
  }
})
export default class TabsTalkVue extends Vue {
  @Prop() readonly scrollEnable: boolean
  readonly loading: string = LoadMoreType.loading
  loadMoreText = { contentdown: '点击显示更多', contentrefresh: '正在加载...', contentnomore: '没有更多数据了,点击刷新' }

  // 用户登录后重新查询
  @Watch('user')
  watchUserChange () {
    //系统不为首次加载
    //必须有this.talkTabObj 且 不为首次加载才行
    if (this.talkTabObj && !this.talkTabObj.firstLoad) {
      //如果当前为关注，则重新查询,否则的话将关注列设置为首次查询
      this.autoChooseUsePositionQueryTalks(true)
      //把非当前的设置为初始
      this.talkTabs.filter(item => item.type !== this.talkTabObj.type).forEach(item => (item.firstLoad = true))
    }
  }

  @talkStore.State('talkTabs') readonly talkTabs: TalkTabVO []
  // 页面初始化模块
  // homeTypeObjs: HomeTypeTalkVO [] = []

  @configStore.Getter('talkCacheNum') readonly talkCacheNum: number

  // 供父组件调用，每次隐藏把数据缓存进storage
  tabsTalkOnHide () {
    // 存入store
    const storeTalkTabs: TalkTabVO[] = []
    this.talkTabs.forEach(item => {
      const storeTalkTab: TalkTabVO = new TalkTabVO()
      storeTalkTab.talks = item.talks.slice(0, this.talkCacheNum)
      storeTalkTab.name = item.name
      storeTalkTab.type = item.type
      storeTalkTab.firstLoad = true
      storeTalkTabs.push(storeTalkTab)
    })
    //缓存记录本次推出时的默认值
    TalkVueUtil.setTalkTabsAll(storeTalkTabs, this.current, this.talkTabObj.type)
  }

  // 生命周期
  created () {
    // DistrictUtil.getCityByIpWebAPI()
    // 更新广告状态
    // 更新广告刷新时间
    this.updateShowAd()
    // 根据本地存储获取之前的 homeName
    // 有了位置才进行查询,因为查询同城需要位置信息
    // 获取位置，查询同城talks使用
  }

  mounted () {
    // 获取元素高度，用来计算scroll-view高度
    this.getTabBarTop()
  }

  @Prop() readonly tabsId: string
  tabsHeight = 0
  // 去除的高度,单位px
  talksListHeightSub = 0
  talksListPaddingBottom = 0

  getTabBarTop () {
    const query: SelectorQuery = uni.createSelectorQuery().in(this)
    // 获取tabs到top的点
    const nodeLeft: NodesRef = query.select('.' + this.tabsId)
    nodeLeft.boundingClientRect((res: any) => {
      if (res) {
        this.tabsHeight = res.height
        // h5有头顶和下边导航栏都算了高度
        // #ifdef H5
        this.talksListHeightSub = 44 + this.tabsHeight
        this.talksListPaddingBottom = UniUtils.upxToPx(100)
        // #endif
        // #ifndef H5
        this.talksListHeightSub = systemModule.statusBarHeight + 44 + this.tabsHeight
        // #endif
      } else {
        // 给5秒
        UniUtils.delayTime(100).then(() => {
          this.getTabBarTop()
        })
      }
    }).exec()
  }

  // scroll-view到底部加载更多
  onreachBottom () {
    // 只要不是没有了就还可以加载
    if (this.talkTabObj.loadMore !== LoadMoreType.noMore) {
      this.autoChooseUsePositionQueryTalks()
    }
  }

  @userStore.State('user') user: UserVO
  // 页面是否为首次查询

  @appStore.State('district') district: DistrictVO
  @Prop() readonly selectTagIds: number[]
  @Prop() readonly userGender: string
  @Prop() readonly userMinAge: number
  @Prop() readonly userMaxAge: number

  //供父组件使用，不可删除
  initQuery () {
    this.autoChooseUsePositionQueryTalks(true)
  }

  autoChooseUsePositionQueryTalks (firstLoad?: boolean) {
    if (appModule.openPosition) {
      this.requestUsePositionQueryTalks(firstLoad)
    } else {
      this.queryTalks(firstLoad)
    }
  }

  // 首次查询时获取详细定位,同城查询时，请求使用地理位置定位，切换至同城时，请求地理位置定位。还有点击同城，弹出选择框时，还有点击定为时
  requestUsePositionQueryTalks (firstLoad?: boolean) {
    // 如果有经纬度，如果附近，就只显示附近，不根据adcode，怎么排序？按这个应该可调，刚开始按天，每小时，每半小时，5分钟排序，然后按距离排序
    // 如果没有经纬度，根据adcode，时间倒序，
    // 用户注册，默认显示中国，点击筛选后，提示，是否切换到附近，点击之后，提示附近
    // 只有用户点了附近，才能获取用户位置
    DistrictUtil.getCurPositionBySDK().then((res: DistrictVO) => {
      if (res) {
        appModule.district.lon = res.lon
        appModule.district.lat = res.lat
      }
      this.queryTalks(firstLoad)
    }).catch(() => {
      this.queryTalks(firstLoad)
    })
  }

  // 默认地理位置是北京，以后可以根据ip获取当前城市
  // 话题的话显示最热门的话题，且只查询包含话题的动态
  queryTalks (firstLoad?: boolean) {
    //只有不为加载中才可以加载
    if (this.talkTabObj.loadMore !== LoadMoreType.loading) {
      // 执行正在加载动画
      this.talkTabObj.loadMore = LoadMoreType.loading
      //只有在传false时校验后面的
      const fistLoad = firstLoad || this.talkTabObj.firstLoad
      // query condition
      const talkIds: number[] = (fistLoad ? [0] : this.talkIds)
      TalkAPI.queryTalksAPI(talkIds, this.district, this.selectTagIds, this.talkTabObj.type, this.userGender, this.userMinAge, this.userMaxAge).then((res: any) => {
        // 如果不是上拉加载，则是下拉刷新，则停止下拉刷新动画
        if (this.talkTabObj.loadMore === LoadMoreType.loading) {
          if (res.data && res.data.length) {
            if (fistLoad) {
              this.talkTabObj.talks = res.data
            } else {
              this.talkTabObj.talks.push(...res.data)
            }
          }
          // 如果还有大于等于10个就还可以加载
          if (res.data && res.data.length >= this.lazyLoadNum) {
            this.talkTabObj.loadMore = LoadMoreType.more
          } else {
            // 否则没有了
            this.talkTabObj.loadMore = LoadMoreType.noMore
          }
        }
      }).catch(() => {
        this.talkTabObj.loadMore = LoadMoreType.more
      })
      this.talkTabObj.firstLoad = false
    }
  }

  queryEnd (firstLoad: boolean) {
    const talkTab = this.talkTabObj
    if (talkTab) {
      const loadMoreState = talkTab.loadMore
      if (loadMoreState === LoadMoreType.loading) {
        talkTab.loadMore = LoadMoreType.more
      } else {
        this.autoChooseUsePositionQueryTalks(firstLoad)
      }
    }
  }

  // 展示的talks
  get talkIds () {
    if (this.talks.length) {
      return this.talks.map(item => item.id)
    }
    return [0]
  }

  get talks (): TalkVO[] {
    if (this.talkTabs && this.talkTabs.length) {
      return this.talkTabObj.talks
    }
    return []
  }

  // 被举报后前台删除talk
  deleteTalk (talkId: number) {
    this.talks.splice(this.talks.findIndex(talk => talk.id === talkId), 1)
  }

  get talkTabObj () {
    if (this.talkTabs && this.talkTabs.length) {
      return this.talkTabs[this.current]
    } else {
      return null
    }
  }

  // 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
  current: number = TalkVueUtil.getCurTalkTabIndex()
  // tabs组件的current值，表示当前活动的tab选项
  swiperCurrent: number = TalkVueUtil.getCurTalkTabIndex()
  // swiper组件的current值，表示当前那个swiper-item是活动的

  // tabs通知swiper切换
  tabsChange (index) {
    if (index === this.swiperCurrent) {
      if (this.talkTabObj.type === TalkTabType.city_type) {
        this.openCityPicker()
      }
      return
    }
    this.swiperCurrent = index
  }

  // talkSwipe
  talkSwiperChange (e) {
    const current = e.detail.current
    this.swiperCurrent = current
    this.current = current
    // 存入store
    // 切换时截取其他的只保留后20条
    this.talkTabs.forEach((item, index) => {
      if (index !== current) {
        item.talks = item.talks.slice(-10)
        item.loadMore = LoadMoreType.more
      }
    })
    //如果首次加载，则需要查询
    if (this.talkTabs[current].firstLoad) {
      this.autoChooseUsePositionQueryTalks(true)
    }
  }

  // 城市选择

  showCityPopup = false

  openCityPicker () {
    this.showCityPopup = true
  }

  cityChange (district: DistrictVO) {
    appModule.setDistrictAction(district)
    this.autoChooseUsePositionQueryTalks(true)
  }

  @appStore.State('appConfig') readonly appConfig: object

  // 每次查询几条
  get lazyLoadNum (): number {
    return this.appConfig[Constants.everyLoadNum] || Constants.everyLoadNum_number
  }

  showAd = false

  // 广告相关
  updateShowAd () {
    // 如果展示广告
    // 获取上次展示时间
    const lastDateStr: string = StorageUtil.get(Constants.lastShowAdTime)
    // 如果有上次展示时间
    if (lastDateStr) {
      const lastDateTime: number = new Date(lastDateStr).getTime()
      const curTime: number = new Date().getTime()
      // 如果已经过了上次展示时间间隔，则继续展示广告
      this.showAd = curTime - lastDateTime > this.showAdMinutes * Constants.minute
    } else {
      this.showAd = true
    }
  }

  // 默认30分钟展示1次
  get showAdMinutes (): number {
    return this.appConfig[Constants.talkShowAdTimeInterval] || Constants.talkShowAdTimeIntervalDefault
  }

  get showAdIndexList (): number[] {
    return this.appConfig[Constants.talkShowAdIndexListKey] || Constants.talkShowAdIndexAryDefault
  }

  @Watch('talks')
  watchTalks () {
    // 如果已有talk数量大于系统阀值，加载出来第2页后，就重置下次看广告时间
    if (this.showAd && this.talks.length >= 50) {
      StorageUtil.set(Constants.lastShowAdTime, String(new Date()))
    }
  }

  lastScrollTop = 0
  curScrollTop = 0
  timeout = null

  // app端兼容问题，滚动页面评论input不会失去焦点，需要手动控制
  talksScrollEvent ({ detail }) {
    // 如果处于获取焦点状态，则失去焦点
    if (talkModule.inputContentFocus) {
      talkModule.inputContentBlur()
    }
    //只有app端处理滚动隐藏显示tabbar逻辑，小程序平台一卡一卡的
    if (systemModule.isApp) {
      this.curScrollTop = detail.scrollTop
      if (!this.timeout) {
        if (this.curScrollTop > (this.lastScrollTop + 50)) {
          uni.hideTabBar()
        } else if (this.curScrollTop < (this.lastScrollTop - 20)) {
          uni.showTabBar()
        } else if (this.curScrollTop < 100 || this.curScrollTop === 0) {
          uni.showTabBar()
        }
        this.lastScrollTop = this.curScrollTop
        this.timeout = setTimeout(() => {
          this.timeout = null
        }, 100)
      }
    }
  }

  toLoginVue () {
    PageUtil.toMinePage()
  }
}
</script>
