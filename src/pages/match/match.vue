<template>
  <view class="h100r bg-default">
    <q-model v-if="showUser" class="bg-white h100r">
      <scroll-view scroll-y class="h100r bg-gray">
        <user-info v-if="showUser" :user.sync="showUser"></user-info>
        <!--            发表动态按钮-->
        <view v-if="showUser"
              class="position-fixed fixed-index b-30px row-around row-between-center w100vw px-20px">
          <button class="cu-btn lg bg-blue cuIcon">
            <q-icon size="42" icon="arrow-leftward" @click="hideShowUser"></q-icon>
          </button>
          <button v-if="showLick" class="cu-btn lg bg-white bd-gray cuIcon" @click="unLickUser">
            <q-icon size="48" icon="close" class="text-gray"></q-icon>
          </button>
          <button v-if="showLick" class="cu-btn lg bg-pink cuIcon" @click="likeUser">
            <q-icon size="50" icon="heart"></q-icon>
          </button>
        </view>
      </scroll-view>
    </q-model>

    <view class="w100vw cu-bar bg-white position-fixed fixed-index top-0">
      <view class="bg-white nav">
        <view class="cu-item" :class="all===matchType?'text-blue cur':''"
              @tap="switchMatchType" :data-id="all">
          全部
        </view>
        <view class="cu-item" :class="iLike===matchType?'text-blue cur':''"
              @tap="switchMatchType" :data-id="iLike">
          喜欢
        </view>
      </view>
      <view class="action">
        <text class="cuIcon-title text-green"></text>
        <text>在线：{{onlineUsersCount}}人</text>
      </view>
    </view>
    <view v-if="showMatchHintKey" class="mt-xl2 row-col-center bg-orange">
      <view class="flex-auto card-text-row">
        匹配规则：在个人信息页面进行照片认证后才可使用匹配功能，互相喜欢后可开启聊天。
      </view>
      <view class="flex-none mr-sm">
        <q-icon icon="close-circle-fill" size="36" @click="closeUploadImgHint"></q-icon>
      </view>
    </view>
    <!--<view class="row-between">
        <view>{{leftHeight}}</view>
        <view>{{rightHeight}}</view>
    </view>-->
    <view class="flex-row w100vw">
      <view class="w360rpx ma-8rpx">
        <match-item v-for="user in leftAry" :user="user" :key="user.id" @deleteMatchUser="deleteLeftMatchUser"
                    @showUser="showLeftUserChange"></match-item>
      </view>
      <view class="w360rpx ma-8rpx">
        <match-item v-for="user in rightAry" :user="user" :key="user.id" @deleteMatchUser="deleteRightMatchUser"
                    @showUser="showRightUserChange"></match-item>
      </view>
    </view>
    <uni-load-more :status="loadMore"></uni-load-more>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UserVO from '@/model/user/UserVO'
import { namespace } from 'vuex-class'
import MatchAPI from '@/api/MatchAPI'
import UserInfo from '@/pages/user/UserInfo.vue'
import MatchItem from '@/pages/match/MatchItem.vue'
import Constants from '@/const/Constant'
import LoadMoreType from '@/const/LoadMoreType'
import MatchType from '@/const/MatchType'
import UniUtil from '@/utils/UniUtil'
import CommonUtil from '@/utils/CommonUtil'
import BalaBala from '@/utils/BalaBala'

const appStore = namespace('app')
const userStore = namespace('user')

@Component({
  components: {
    UserInfo, MatchItem
  }
})
export default class MatchVue extends Vue {
  @userStore.State('user') user: UserVO
  @appStore.State('appConfig') readonly appConfig: object
  @appStore.State('onlineUsersCount') readonly onlineUsersCount: object
  leftHeight = 0
  rightHeight = 0
  matchUsers: UserVO[] = []
  leftAry: UserVO[] = []
  rightAry: UserVO[] = []
  showUser: UserVO = null
  leftOrRight = ''
  matchType: string = MatchType.all
  all: string = MatchType.all
  iLike: string = MatchType.iLike
  loadMore: string = LoadMoreType.more
  showMatchHintKey: boolean = uni.getStorageSync(Constants.showMatchHintKey) !== 'false'

  showUserPopup = false

  closeUploadImgHint () {
    this.showMatchHintKey = false
    uni.setStorageSync(Constants.showMatchHintKey, 'false')
  }

  onShow () {
    // todo 每次查询一下在线人数
    // 每次查询match也查询一下在线人数
  }

  switchMatchType (e) {
    this.matchType = e.currentTarget.dataset.id
    this.startPullDownRefresh()
  }

  // 每次查询几条
  get lazyLoadNum (): number {
    return this.appConfig[Constants.matchUserEveryLoadNum_Key] || Constants.matchUserEveryLoadNum_number
  }

  onLoad () {
    this.startPullDownRefresh()
    CommonUtil.showShareMenu()
  }

  stopPullDownRefresh () {
    uni.stopPullDownRefresh()
  }

  startPullDownRefresh () {
    uni.startPullDownRefresh()
  }

  onPullDownRefresh () {
    this.initQuery()
  }

  // 初始查询，会清空已有talk
  initQuery () {
    // 首次加载页面，调用下拉刷新
    // 如果已登录则查询用户通知
    this.matchUsers = []
    this.leftAry = []
    this.rightAry = []
    this.leftHeight = 0
    this.rightHeight = 0
    this.queryMatches()
  }

  queryMatches () {
    MatchAPI.queryMatchUsersAPI(this.userIds, this.matchType).then((res: any) => {
      this.stopPullDownRefresh()
      const users: UserVO[] = res.data
      this.matchUsers.push(...users)
      // 必须使用users，如果使用matchUsers就会遍历之前的内容了
      users.forEach((item) => {
        const itemHeight = Math.min(item.imgs[0].height, 600) + 119
        if (this.leftHeight > this.rightHeight) {
          this.rightAry.push(item)
          this.rightHeight += itemHeight
        } else {
          this.leftAry.push(item)
          this.leftHeight += itemHeight
        }
      })
      if (res.data && res.data.length >= this.lazyLoadNum) {
        this.loadMore = LoadMoreType.more
      } else {
        // 否则没有了
        this.loadMore = LoadMoreType.noMore
      }
    }).catch(() => {
      this.stopPullDownRefresh()
    })
  }

  onReachBottom () {
    // 只要不是没有了就还可以加载
    if (this.loadMore !== LoadMoreType.noMore) {
      // 执行正在加载动画
      this.loadMore = LoadMoreType.loading
      this.queryMatches()
    }
  }

  get userIds () {
    if (this.matchUsers.length) {
      return this.matchUsers.map(item => item.id)
    }
    return [0]
  }

  get isMine (): boolean {
    // 两个都有值，且两个都相等，才为自己
    return this.user && this.showUser && this.user.id === this.showUser.id
  }

  get showLick (): boolean {
    // 默认可以喜欢比自己高10分的用户
    return Boolean(!this.isMine && this.showUser)
  }

  showLeftUserChange (user: UserVO) {
    this.leftOrRight = Constants.leftKey
    this.showUser = user
  }

  showRightUserChange (user: UserVO) {
    this.showUserPopup = true
    this.leftOrRight = Constants.rightKey
    this.showUser = user
  }

  deleteLeftMatchUser (userId: number) {
    const userIndex: number = this.leftAry.findIndex(user => user.id === userId)
    const itemHeight = Math.min(this.leftAry[userIndex].imgs[0].height, 600) + 119
    this.leftAry.splice(userIndex, 1)
    this.leftHeight -= itemHeight
  }

  deleteRightMatchUser (userId: number) {
    const userIndex: number = this.rightAry.findIndex(user => user.id === userId)
    const itemHeight = Math.min(this.rightAry[userIndex].imgs[0].height, 600) + 119
    this.rightAry.splice(userIndex, 1)
    this.rightHeight -= itemHeight
  }

  hideShowUser () {
    this.showUserPopup = false
    this.showUser = null
    this.leftOrRight = ''
  }

  unLickUser () {
    if (this.user) {
      if (this.user.imgs && this.user.imgs.length && this.user.phoneNum) {
        // #ifndef MP-WEIXIN
        if (this.user.isSelfAuth) {
          // #endif
          UniUtil.toast('不喜欢')
          // 还要减去高度，还有加高度
          MatchAPI.unlikeUserAPI(this.showUser.id)
          if (this.leftOrRight === Constants.leftKey) {
            this.deleteLeftMatchUser(this.showUser.id)
          } else {
            this.deleteRightMatchUser(this.showUser.id)
          }
          this.hideShowUser()
          // #ifndef MP-WEIXIN
        } else {
          BalaBala.unIdentityAuth()
        }
        // #endif
      } else {
        BalaBala.unUploadImg()
      }
    } else {
      BalaBala.unLoginMessage()
    }
  }

  likeUser () {
    if (this.user) {
      if (this.user.imgs && this.user.imgs.length && this.user.phoneNum) {
        // 微信平台规则，不允许认证相关功能
        // #ifndef MP-WEIXIN
        if (this.user.isSelfAuth) {
          // #endif
          UniUtil.toast('喜欢')
          // 还要减去高度，还有加高度
          MatchAPI.likeUserAPI(this.showUser.id)
          if (this.leftOrRight === Constants.leftKey) {
            this.deleteLeftMatchUser(this.showUser.id)
          } else {
            this.deleteRightMatchUser(this.showUser.id)
          }
          this.hideShowUser()
          // #ifndef MP-WEIXIN
        } else {
          BalaBala.unIdentityAuth()
        }
        // #endif
      } else {
        BalaBala.unUploadImg()
      }
    } else {
      BalaBala.unLoginMessage()
    }
  }
}
</script>
