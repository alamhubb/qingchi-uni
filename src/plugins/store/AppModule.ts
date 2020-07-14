import { VuexModule, Module, Action } from 'vuex-class-modules'
import DistrictVO from '@/model/DistrictVO'
import TagVO from '@/model/tag/TagVO'
import { appModule, configModule, talkModule } from './index'
import TagAPI from '@/api/TagAPI'
import HomeSwiperVO from '@/model/HomeSwiperVO'
import TagTypeVO from '@/model/tag/TagTypeVO'
import AppInitAPI from '@/api/AppInitAPI'
import ResultVO from '@/model/ResultVO'
import AppInitDataVO from '@/model/common/AppInitDataVO'
import UserStore from '@/plugins/store/UserStore'
import DistrictUtil from '@/utils/DistrictUtil'
import DistrictAPI from '@/api/DistrictAPI'
import NotifyAPI from '@/api/NotifyAPI'
import UnreadNotifyVO from '@/model/UnreadNotifyVO'
import UserVO from '@/model/user/UserVO'
import AppInitQueryVO from '@/model/common/AppInitQueryVO'
import TalkVueUtil from '@/utils/TalkVueUtil'
import LoadMoreType from '@/const/LoadMoreType'
import UniUtil from '@/utils/UniUtil'

@Module({ generateMutationSetters: true })
export default class AppModule extends VuexModule {
  // 系统加载时通过getDistrictAction赋值
  //有记录的花记录上一次的，没有记录的话初始全国的
  openPosition: boolean = DistrictUtil.getOpenPosition()
  district: DistrictVO = DistrictUtil.getDistrict()
  districts: DistrictVO [] = []
  notifies: UnreadNotifyVO [] = []
  reportTypes: string[] = []
  tags: TagVO[] = []
  tagTypes: TagTypeVO[] = []
  homeSwipers: HomeSwiperVO[] = []
  // 动态页展示广告,设置一些默认值，在这里设置还是去使用的地方设置
  appConfig: any = {}
  onlineUsersCount = 0

  get unreadNotifies (): UnreadNotifyVO [] {
    return this.notifies.filter(item => !item.hasRead)
  }

  @Action
  openPositionAction () {
    this.openPosition = true
    DistrictUtil.openPosition()
  }

  @Action
  setDistrictAction (district: DistrictVO) {
    //只要开启过定位就不再关闭
    //如果空值则默认中国
    if (!district || !district.adCode) {
      // 远程获取，获取不到返回中国
      // storeAge存储
      district = DistrictUtil.chinaDistrict
    }
    DistrictUtil.setDistrict(district)
    this.district = district
  }

  @Action
  getTagsAction () {
    TagAPI.queryTagsAPI().then((res: any) => {
      this.tags = res.data
    })
  }

  // actions
  @Action
  async getTagTypes () {
    return TagAPI.queryTagTypesAPI().then((res: any) => {
      this.tagTypes = res.data
    })
  }

  // actions
  @Action
  initGlobalDataLoadAPI () {
    // 静态类，方法，只要使用这个方法，参数能自动传进来
    // 查询所有地区相关
    const talkTabIndex = TalkVueUtil.getCurTalkTabIndex()
    const tabObj = talkModule.talkTabs[talkTabIndex]
    tabObj.loadMore = LoadMoreType.loading
    const district = appModule.district

    const initQueryVO = new AppInitQueryVO(tabObj, district)

    AppInitAPI.queryAppInitDataLoadAPI(initQueryVO).then((res: ResultVO<AppInitDataVO>) => {
      tabObj.talks = res.data.talks
      // 应用全局数据
      this.appConfig = res.data.appConfig
      this.homeSwipers = res.data.homeSwipers
      // 应用配置
      configModule.appConfig = res.data.appConfig
      configModule.showSwipers = this.appConfig.showSwipers
      //初始第一次查询才赋值
      if (district.adCode === DistrictUtil.initAdCode) {
        appModule.setDistrictAction(res.data.district)
      } else {
        //只有未开启定位时，才使用后台返回的经纬度
        if (!appModule.openPosition) {
          if (res.data.district) {
            district.lat = res.data.district.lat
            district.lon = res.data.district.lon
          }
        }
      }
    }).finally(() => {
      tabObj.loadMore = LoadMoreType.more
      //延迟1秒。避免user watch重复查询，只要在这些时间内不登陆就没问题，只要在watch之后就没问题。在差的机子500毫秒也反应过来了吧。
      UniUtil.delayTime(500).then(() => {
        tabObj.firstLoad = false
      })
    })
  }

  // actions
  @Action
  initGlobalDataReadyAPI () {
    AppInitAPI.queryAppInitDataReadyAPI().then((res: ResultVO<AppInitDataVO>) => {
      UserStore.initUserStore(res)
      // 应用全局数据
      this.tags = res.data.tags
      this.tagTypes = res.data.tagTypes
      this.reportTypes = res.data.reportTypes
      this.districts = res.data.districts
      this.onlineUsersCount = res.data.onlineUsersCount
    })
  }

  @Action
  addUnreadNotifies (user: UserVO) {
    const notify: UnreadNotifyVO = new UnreadNotifyVO()
    notify.hasRead = false
    notify.avatar = user.avatar
    notify.nickname = user.nickname
    notify.vipFlag = user.vipFlag
    // 从列表中加入这个
    this.notifies.unshift(notify)
  }

  @Action
  getDistrictsAction () {
    // 查询所有城市
    DistrictAPI.queryDistrictsAPI().then((res: any) => {
      this.districts = res.data
    })
  }

  @Action
  queryUnreadNotifiesAndUpdateHasReadAction () {
    // 通知后台和前台把消息改为已读
    return NotifyAPI.queryUnreadNotifiesAndUpdateHasRead().then((res: any) => {
      this.notifies = res.data
      this.notifies.forEach(item => {
        item.hasRead = true
      })
    })
  }
}
