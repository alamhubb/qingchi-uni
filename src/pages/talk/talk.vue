<template>
  <view class="flex-col h100r bg-default">
    <view v-show="showTagSearch" class="h100r">
      <tag-search class="h100r" v-model="showTagSearch" @change="changeTag"
      ></tag-search>
    </view>
    <view v-show="!showTagSearch" class="flex-col h100r">
      <q-navbar>
        <q-search class="flex-auto" @click.native="openTagSearchVue">
          <q-icon class="mx-5px text-gray" size="30" icon="search"></q-icon>
          <view v-if="selectTag" class="flex-row flex-auto">
            <view class="cu-tag round bg-green-plain light row-all-center">
              {{selectTag.name}}
            </view>
          </view>
          <input v-else :adjust-position="false" type="text"
                 placeholder="选择话题" confirm-type="search"/>
          <q-icon v-if="selectTag" class="mr-sm text-gray row-all-center" size="28" icon="close"
                  @click.native.stop="deleteTag(selectTag)"
          ></q-icon>
        </q-search>
        <view class="mr-sm" :class="{'text-blue':useFilters}">
          <q-icon icon="mdi-filter-variant" size="56" @click="showFilterModel"></q-icon>
        </view>
        <view v-if="user" class="position-relative mr-sm">
          <q-icon icon="bell-fill" size="56" @click="toNotifyVue"></q-icon>
          <u-badge :count="unreadNotifiesNum" size="mini"
                   :offset="[0, 0]" @click="toNotifyVue"></u-badge>
        </view>
        <view class="mr-sm">
          <q-icon icon="plus-circle" size="56" @click="toTalkAdd"></q-icon>
        </view>
      </q-navbar>

      <q-popup v-model="showFilter" bottom>
        <q-bar round class="solid-bottom">
          <view class="text-black text-lgg text-bold">筛选</view>
          <view class="flex-row">
            <view class="text-blue text-bold mx-xs px" @click="hideFilter">取消</view>
            <view class="text-green text-bold ml-lg mr-sm px" @click="filterQuery">确定</view>
          </view>
        </q-bar>
        <view class="mt-sm px-xl pb-xxl">
          <view class="flex-row px-15px pt-lg">
            <view class="w70px row-start">性别：</view>
            <radio-group @change="genderChange">
              <label v-for="report in genders" :key="report">
                <radio :value="report" :checked="report===genderValue"></radio>
                <text class="ml-xs mr-xl">{{report}}</text>
              </label>
            </radio-group>
          </view>
          <view class="mt-20px pb-xl pt-sm">
            <view class="row-between px-15px">
              <view>年龄：{{rangeValue[0]}} - {{rangeValue[1]}}</view>
            </view>
            <view class="px-lg">
              <q-slider
                  :value="rangeValue"
                  :min="rangeMin"
                  :max="rangMax"
                  :bar-height="3"
                  active-color="#FF6B00"
                  :format="format"
                  @change="handleRangeChange"
              ></q-slider>
            </view>
          </view>
        </view>
      </q-popup>

      <talk-swipers v-if="configShowSwipers"></talk-swipers>

      <tabs-talk class="flex-auto" ref="tabsTalk" :scrollEnable="scrollEnable"
                 :selectTagIds="selectTagIds"
                 :userGender="userGender"
                 :userMinAge="userMinAge"
                 :userMaxAge="userMaxAge"
                 :tabs-id="tabsId"
      ></tabs-talk>
    </view>

    <!--            评论输入框按钮-->
    <msg-input v-if="showMsgInput">
    </msg-input>
  </view>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Watch
} from 'vue-property-decorator'

import TalkItem from '@/pages/talk/TalkItem.vue'
import { namespace } from 'vuex-class'
import PagePath from '@/const/PagePath'
import UnreadNotifyVO from '@/model/UnreadNotifyVO'
import TagVO from '@/model/tag/TagVO'
import PageUtil from '@/utils/PageUtil'
import TalkFilterUtil from '@/utils/TalkFilterUtil'
import UniUtils from '@/utils/UniUtils'
import TalkSwipers from '@/pages/talk/talkSwipers.vue'
import TabsTalk from '@/pages/talk/tabsTalk.vue'
import { appModule, systemModule, talkModule } from '@/plugins/store'
import UserVO from '@/model/user/UserVO'
import TagSearch from '@/pages/talk/TagSearch.vue'
import CommonUtil from '@/utils/CommonUtil'
import NodesRef = UniApp.NodesRef
import SelectorQuery = UniApp.SelectorQuery

const talkStore = namespace('talk')
const userStore = namespace('user')
const appStore = namespace('app')
const configStore = namespace('config')

// todo 后台可控制是否显示轮播图

@Component({
  components: {
    TagSearch,
    TabsTalk,
    TalkSwipers,
    TalkItem
  }
})
export default class TalkVue extends Vue {
  public $refs!: {
    tabsTalk: any;
  }

  onLoad () {
    CommonUtil.showShareMenu()
  }

  // 唯一id值
  readonly uuid: string = 'u' + UniUtils.getUUID()
  readonly tabsId: string = this.uuid + '_tabs'

  // life
  onReady () {
    appModule.initGlobalDataReadyAPI()
    // 不这么写百度读不出来
    UniUtils.delayTime(100).then(() => {
      this.getTabBarTop()
    })
    // 这里是不是有问题应该选择异性
    // 指的是用户选择的筛选性别
    this.genderValue = this.userGender
    this.rangeValue = [this.userMinAge, this.userMaxAge]
  }

  // 滚动超过轮播图隐藏轮播图，scroll-view开启滚动
  scrollEnable = false

  getTabBarTop () {
    let query: SelectorQuery
    // #ifdef H5
    query = uni.createSelectorQuery().in(this)
    // #endif
    // #ifndef H5
    query = uni.createSelectorQuery().in(this.$refs.tabsTalk)
    // #endif
    // 获取tabs到top的点
    const nodeLeft: NodesRef = query.select('.' + this.tabsId)
    nodeLeft.boundingClientRect((res: any) => {
      if (res) {
        // 44 为导航栏的高度
        // #ifdef H5
        this.talkTabsTop = res.top - 44
        // #endif
        // #ifndef H5
        this.talkTabsTop = res.top - 44 - systemModule.statusBarHeight
        // #endif
        // app平台0.000000x小数，所以写1余量
        if (this.talkTabsTop <= 1) {
          this.scrollEnable = true
        }
      } else {
        UniUtils.delayTime(100).then(() => {
          this.getTabBarTop()
        })
      }
    }).exec()
  }

  // todo 有个1
  onShow () {
    this.showMsgInput = true
  }

  onHide () {
    this.showMsgInput = false
    this.$refs.tabsTalk.tabsTalkOnHide()
  }

  // 传入子组件，控制组件高度
  talkTabsTop = 0

  onPageScroll (e) {
    // 只有开启了轮播图，才需要控制下方滚动
    if (this.configShowSwipers) {
      // +5点余量以防万一
      const scrollTop = e.scrollTop + 1
      // 只有不可滚动时，且大于选项卡高度，才改为可用
      if ((!this.scrollEnable) && scrollTop >= this.talkTabsTop) {
        this.scrollEnable = true
      } else if (this.scrollEnable && scrollTop < this.talkTabsTop) {
        this.scrollEnable = false
      }
    } else {
      // 如果不显示轮播图，则下方talks一定可以滚动
      this.scrollEnable = true
    }
  }

  // 去除页面初始化的，初始化查询
  initQuery () {
    this.$refs.tabsTalk.initQuery()
  }

  // tag 相关
  showTagSearch = false
  selectTag: TagVO = null

  openTagSearchVue () {
    appModule.getTagTypes()
    this.showTagSearch = true
  }

  // tag
  changeTag (tag: TagVO) {
    this.selectTag = tag
    this.initQuery()
  }

  deleteTag () {
    this.selectTag = null
    this.initQuery()
  }

  get selectTagIds (): number[] {
    if (this.selectTag) {
      return [this.selectTag.id]
    } else {
      return []
    }
  }

  // 筛选相关
  rangeMin: number = TalkFilterUtil.minAgeFilterDefault
  rangMax: number = TalkFilterUtil.maxAgeFilterDefault
  genders: string [] = ['全部', '男', '女']
  // 组件内的值
  genderValue: string = TalkFilterUtil.genderFilterDefault
  rangeValue: number[] = [TalkFilterUtil.minAgeFilterDefault, TalkFilterUtil.maxAgeFilterDefault]

  // 轮播图
  @talkStore.State('userMinAge') userMinAge: number
  @talkStore.State('userMaxAge') userMaxAge: number
  @talkStore.State('userGender') userGender: string

  // filter内容
  showFilter = false

  showFilterModel () {
    this.showFilter = true
    //修复打开filter时，当前值不对的问题
    this.genderValue = this.userGender
    this.rangeValue = [this.userMinAge, this.userMaxAge]
  }

  hideFilter () {
    this.showFilter = false
    this.genderValue = this.userGender
    this.rangeValue = [this.userMinAge, this.userMaxAge]
  }

  get useFilters (): boolean {
    return this.userGender !== TalkFilterUtil.genderFilterDefault ||
      this.userMinAge !== TalkFilterUtil.minAgeFilterDefault ||
      this.userMaxAge !== TalkFilterUtil.maxAgeFilterDefault
  }

  format () {
    return ''
  }

  handleRangeChange (e) {
    this.rangeValue = e
  }

  genderChange ({ target }) {
    this.genderValue = target.value
  }

  filterQuery () {
    talkModule.userGender = this.genderValue
    talkModule.userMinAge = this.rangeValue[0]
    talkModule.userMaxAge = this.rangeValue[1]
    TalkFilterUtil.setFilterData(talkModule.userGender, talkModule.userMinAge, talkModule.userMaxAge)
    this.hideFilter()
    this.initQuery()
  }

  // 点击通知去通知页
  @userStore.State('user') user: UserVO
  @appStore.Getter('unreadNotifies') unreadNotifies: UnreadNotifyVO[]
  unreadNotifiesNum = 0

  toNotifyVue () {
    appModule.queryUnreadNotifiesAndUpdateHasReadAction()
    PageUtil.navigateTo(PagePath.notify)
  }

  // 必须这么写否则不生效
  @Watch('unreadNotifies')
  unreadNotifiesWatch () {
    this.unreadNotifiesNum = this.unreadNotifies.length
  }

  // 点击加号去新增talk
  toTalkAdd () {
    PageUtil.toTalkAddPage()
  }

  // 轮播图
  @talkStore.State('showSwipers') showSwipers: boolean
  @configStore.State('showSwipers') configShowSwipers: boolean

  @Watch('configShowSwipers')
  configShowSwipersWatch () {
    UniUtils.delayTime(100).then(() => {
      this.getTabBarTop()
    })
  }

  // 评论输入框
  showMsgInput = false
}
</script>
