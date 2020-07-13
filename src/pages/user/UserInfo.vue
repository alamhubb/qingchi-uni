<template>
  <view v-if="userProp" class="bg-default">
    <view class="bg-white">
      <view>
        <swiper v-if="imgUrls.length" class="square-dot sizeUserImg">
          <swiper-item v-for="(img,index) in imgUrls" :key="img">
            <image class="size100vw" @longpress="showBottomMenuClick(index)"
                   :data-src="img"
                   @click="previewImage"
                   mode="aspectFill"
                   :src="img"
            ></image>
          </swiper-item>
        </swiper>
        <image v-else class="sizeUserImg" @click="showBottomMenuClick(0)"
               mode="aspectFill"
               src="https://cdxapp-1257733245.cos.ap-beijing.myqcloud.com/qingchi/static/uploadimgmini.png"
        ></image>
        <view v-if="showUploadImgHint && imgUrls.length" class="row-col-center bg-orange">
          <view class="flex-auto flex-row px">
            单击图片预览，长按图片进行操作
          </view>
          <view class="flex-none mr-10px">
            <q-icon icon="close-circle-fill" size="36" @click="closeUploadImgHint"></q-icon>
          </view>
        </view>
      </view>

      <view class="q-box">
        <view class="q-box-row">
          <image
              class="avatar mr-sm"
              mode="aspectFill"
              :src="userProp.avatar"
          />
          <view class="flex-auto row-between">
            <view class="flex-col flex-auto">
              <view v-if="userProp.vipFlag" class="text-red text-lg">
                {{userProp.nickname}}
              </view>
              <view v-else class="text-lg">
                {{userProp.nickname}}
              </view>
              <view>
                <view v-if="isMine" class="cu-tag bd-red radius sm mr-10px bg-white"
                      @click.stop="toFollowVue">
                  关注：{{userProp.followNum}}
                </view>

                <view class="cu-tag bd-orange radius sm mr-10px bg-white" @click.stop="toFollowVue">
                  粉丝：{{userProp.fansNum}}
                </view>
              </view>
            </view>
            <!--                不为自己且未关注-->
            <view v-if="!isMine" class="col-center">
              <button class="cu-btn round px-15px bg-white"
                      :class="'bd-'+getFollowStatusColor(followStatus)"
                      @click.stop="addFollow">
                <text>{{followStatus}}</text>
              </button>
            </view>
            <view v-if="isMine">
              <button class="cu-btn round bd-green px-12px bg-white"
                      @click="moreAction">
                <q-icon size="28" icon="edit-pen" class="mr-xs"/>
                操作
              </button>
            </view>
          </view>
        </view>
        <view class="q-box-row">
          <view class="cu-tag radius text-df"
                :class="[getGenderBgColor(userProp)]">
            {{userProp.age}}
            <q-icon class="row-col-start ml-2px" size="24"
                    :icon="getGenderIcon(userProp)"/>
          </view>
          <view v-if="userProp.vipFlag" class="cu-tag bg-red radius" @click="openVip">VIP</view>
          <view v-else class="cu-tag bg-grey radius" @click="openVip">VIP</view>
          <view class="ml-5px cu-capsule radius" @click="hintJusticeInfo">
            <view class='cu-tag bg-green'>
              <q-icon size="24" icon="mdi-sword-cross"/>
            </view>
            <view class="cu-tag bg-white bd-green bd-r-radius">
              {{userProp.justiceValue}}
            </view>
          </view>
          <view class="ml-5px cu-capsule radius" @click="toLoveValuePage">
            <view class='cu-tag bg-red'>
              <q-icon size="24" icon="heart-fill"/>
            </view>
            <view class="cu-tag bg-white bd-red bd-r-radius">
              {{userProp.loveValue}}
            </view>
          </view>
          <view class="ml-5px cu-capsule radius" @click="toFaceValuePage">
            <view class='cu-tag bg-orange'>
              <q-icon size="26" icon="mdi-face"/>
            </view>
            <view class="cu-tag bg-white bd-orange bd-r-radius">
              {{userProp.faceRatio}}
            </view>
          </view>
        </view>

        <view class="q-box-row q-solid-bottom">
          <q-icon class="text-gray mr-xs" size="50" icon="map-fill"/>
          地区：{{userProp.location}}
        </view>

        <view v-if="isMine" class="q-box-row q-solid-bottom">
          <q-icon class="text-gray mr-xs" size="50" icon="mdi-cellphone-android"/>
          手机号(仅自己可见)：
          <view v-if="userProp.phoneNum">
            {{userProp.phoneNum}}
            <view class="ml-10px sm cu-tag bg-white bd-gray radius">
              已绑定
            </view>
          </view>
          <view v-else>
            <!-- #ifdef MP-WEIXIN -->
            <button class="cu-btn radius sm bg-orange" :disabled="phoneBtnDisabled"
                    open-type="getPhoneNumber"
                    @getphonenumber="getPhoneNumberByWx">绑定
            </button>
            <q-icon class="ml-10px text-gray" size="26" icon="error-circle"
                    @click="hintBindTwice"></q-icon>
            <text class="text-gray" @click="hintBindTwice">
              (老用户需操作两次)
            </text>
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            <button class="cu-btn radius sm bg-orange"
                    @click="toPhonePage">绑定
            </button>
            <!-- #endif -->
          </view>
        </view>

        <!-- #ifndef MP-WEIXIN -->
        <view class="q-box-row q-solid-bottom">
          <q-icon class="text-gray mr-xs" size="50" icon="mdi-alpha-v-circle"/>
          照片认证：
          <!-- 为自己且未绑定-->
          <view class="row-between-center flex-auto" v-if="userProp.isMine && !userProp.isSelfAuth">
            未认证
            <button class="mr-xs cu-btn sm bd-none text-sm bd-box-radius bg-orange"
                    @click="toIdentityAuth">认证
            </button>
          </view>
          <view v-else>
            <view class="ml-10px sm cu-tag bg-blue radius" v-if="userProp.isSelfAuth">
              已认证
            </view>
            <view class="ml-10px sm cu-tag bg-white bd-gray radius" v-else>
              未认证
            </view>
          </view>
        </view>
        <!-- #endif -->
        <!--<view v-if="userProp.wxAccount" class="q-box-row q-solid-bottom">
          微信：
          <text selectable>{{userProp.wxAccount}}</text>
          <button class="cu-btn radius sm bd-blue ml-10px bg-white"
                  @click="copyText(userProp.wxAccount)">
            复制
          </button>
        </view>-->
        <view v-if="isMine && !userProp.contactAccount" class="q-box-row row-between-center bg-active"
              @click="$pageUtil.toUserContactInfoPage">
          <view class="row-col-center">
            <text class="text-lgg text-orange">他人获取您的联系方式时，您就能获得贝壳</text>
          </view>
          <view class="text-gray row-col-center pr-xs">
            <text class="text-lgg text-gray text-lgg">详情</text>
            <q-icon class="text-gray" size="32" icon="arrow-right"/>
          </view>
        </view>
        <!-- 如果自己的话-->
        <!-- 左边格式不变，如果未填写则可以填写，填写之后可以选择开启或者关闭，填写后可选择隐藏展示。-->
        <view class="q-box-row row-between-center q-solid-bottom">
          <view class="row-col-center">
            <q-icon class="text-gray mr-xs" size="50" icon="account"/>
            联系方式：
            <text v-if="userProp.contactAccount">{{userProp.contactAccount}}</text>
            <text v-else>
              未填写
            </text>
          </view>
          <view v-if="isMine" class="row-between-center">
            <view v-if="userProp.contactAccount" class="row-between-center">
              <text v-if="userProp.openContact" class="mr-xs text-green">展示中</text>
              <text v-else class="mr-xs text-gray">已隐藏</text>
              <u-switch v-model="userProp.openContact" active-color="#00C853" @change="switchOpenContact"></u-switch>
            </view>
            <button v-else class="mr-xs cu-btn sm bd-none text-sm bd-box-radius bg-orange"
                    @click="openEditDialog">
              填写联系方式
            </button>
          </view>
          <view v-else-if="userProp.contactAccount">
            <view v-if="!userProp.openContact" class="mr-sm">
              对方隐藏了联系方式
            </view>
            <button v-else-if="userProp.showUserContact" class="mr-xs cu-btn sm bd-none text-sm bd-box-radius bg-orange"
                    @click="$util.textCopy(userProp.contactAccount)">
              复制
            </button>
            <button v-else :disabled="showUserContactBtnDisabled"
                    class="mr-xs cu-btn sm bd-none text-sm bd-box-radius bg-blue"
                    @click="shellPayForUserContact">
              10 贝壳获取
            </button>
          </view>
        </view>
        <view v-if="isMine" class="q-box-row row-between-center" @click="toUserShell">
          <view class="row-col-center">
            <q-icon class="text-green mr-xs" size="50" icon="mdi-bitcoin"/>
            <text class="text-lgg">我的贝壳（{{mineUser.shell}}）</text>
          </view>
          <view v-if="!isIos" class="text-gray row-col-center pr-xs">
            <text class="text-lgg text-gray text-lgg">充值</text>
            <q-icon class="text-gray" size="32" icon="arrow-right"/>
          </view>
        </view>
      </view>
    </view>

    <uni-popup ref="reportDialog" :custom="true" :mask-click="false">
      <view class="uni-tip">
        <view class="uni-tip-title">举报</view>
        <view class="uni-tip-content">
          <radio-group class="uni-list" @change="reportTypeChange">
            <label class="uni-list-cell flex-row uni-list-cell-pd"
                   v-for="report in reportTypes" :key="report">
              <view>
                <radio :id="report" :value="report" :checked="report===pornInfo"></radio>
              </view>
              <view>
                <label class="ml-10px" :for="report">
                  <text>{{report}}</text>
                </label>
              </view>
            </label>
          </radio-group>
        </view>
        <view class="uni-textarea bd-1 bd-radius">
            <textarea placeholder="其他违规必填，其他情况选填，可详细陈述观点" v-model.trim="reportContent"
                      :show-confirm-bar="false"
            />
        </view>
        <view class="uni-tip-group-button">
          <button class="uni-tip-button w40r" type="default" @click="closeDialogAndInitData"
                  :plain="true">
            取消
          </button>
          <button class="uni-tip-button w40r" type="primary" @click="addReport" :disabled="!reportType">确定
          </button>
        </view>
      </view>
    </uni-popup>

    <talk-operate @deleteTalk="deleteTalk"></talk-operate>
    <!--qq平台显示的广告-->
    <!--  #ifdef MP-QQ -->
    <ad v-if="talks.length>0" class="bg-white mb-5px" unit-id="72d8cb09a1bae9fa30d9e03e7cb8a25d" type="feeds"></ad>
    <!--  #endif -->
    <!--<view v-for="talk in talks" :key="talk.id">
      <talk-item :talk="talk" @deleteTalk="deleteTalk"></talk-item>
    </view>-->
    <!--wx平台显示的广告-->
    <!--  #ifdef MP-WEIXIN -->
    <ad class="bg-white mb-5px" unit-id="adunit-65c8911d279d228f" ad-type="video" ad-theme="white"></ad>
    <!--  #endif -->
    <!--qq平台显示的广告-->
    <!--  #ifdef MP-QQ -->
    <ad class="bg-white mb-5px" unit-id="bcc21923107071ac3f8aa076c7e00229" type="card"></ad>
    <!--  #endif -->

    <!--  #ifdef APP-PLUS -->
    <!--    <ad class="bg-white mb-5px" adpid="1890536227"></ad>-->
    <!--  #endif -->

    <uni-popup ref="editPopup" type="center">
      <user-edit @close="closeUserEditPop"></user-edit>
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Watch, PropSync } from 'vue-property-decorator'
import TalkAPI from '@/api/TalkAPI'
import TalkItem from '@/pages/talk/TalkItem.vue'
import UserVO from '@/model/user/UserVO'
import UserUtil from '@/utils/UserUtil'
import TalkItemContent from '@/pages/talk/TalkItemContent.vue'
import FollowAddVO from '@/model/FollowAddVO'
import { namespace } from 'vuex-class'
import UserEdit from '@/pages/user/UserEdit.vue'
import UniUtil from '@/utils/UniUtil'
import PagePath from '@/const/PagePath'
import FollowAPI from '@/api/FollowAPI'
import FollowStatus from '@/const/FollowStatus'
import PageUtil from '@/utils/PageUtil'
import LoginDataVO from '@/model/login/LoginDataVO'
import LoginService from '@/pages/user/LoginService'
import LoginAPI from '@/api/LoginAPI'
import LoginUtil from '@/utils/LoginUtil'
import ErrorCode from '@/const/ErrorCode'
import ImgFileVO from '@/model/ImgFileVO'
import ImgUtil from '@/utils/ImgUtil'
import CosUtil from '@/utils/CosUtil'
import UserAPI from '@/api/UserAPI'
import Constants from '@/const/Constant'
import ReportContentType from '@/const/ReportContentType'
import ReportType from '@/const/ReportType'
import ReportAddVO from '@/model/report/ReportAddVO'
import ReportAPI from '@/api/ReportAPI'
import UserStore from '@/plugins/store/UserStore'
import TalkOperate from '@/pages/talk/talkOperate.vue'
import TalkVO from '@/model/talk/TalkVO'
import BalaBala from '@/utils/BalaBala'
import ConfigMap from '@/const/ConfigMap'
import PlatformUtils from '@/utils/PlatformUtils'
import { systemModule } from '@/plugins/store'
import QRowItem from '@/components/q-row-item/q-row-item.vue'
import QRow from '@/components/q-row/q-row.vue'
import MsgUtil from '@/utils/MsgUtil'

const userStore = namespace('user')
const appStore = namespace('app')
const configStore = namespace('config')
const systemStore = namespace('system')

@Component({
  components: { QRow, QRowItem, TalkOperate, UserEdit, TalkItem, TalkItemContent }
})
export default class UserInfo extends Vue {
  $refs!: {
    reportDialog: any;
    editPopup: any;
  }

  @userStore.State('user') mineUser: UserVO
  @appStore.State('appConfig') readonly appConfig: object
  @appStore.State('reportTypes') reportTypes: string[]
  @systemStore.State('isIos') isIos: boolean
  @PropSync('user') userProp: UserVO
  followBtnDisabled = false
  hasFollowed = false
  followStatus: string = FollowStatus.follow
  phoneBtnDisabled = false
  imgIndex = 0
  showUploadImgHint: boolean = uni.getStorageSync(Constants.showUploadImgHintKey) !== 'false'
  readonly reportContentType: string = ReportContentType.userImg
  reportType: string = ReportType.pornInfo
  pornInfo: string = ReportType.pornInfo
  reportContent = ''
  talks: TalkVO[] = []
  @configStore.Getter(ConfigMap.reportHideCountKey) reportHideCount: number

  showUserContactBtnDisabled = false

  shellPayForUserContact () {
    if (!this.showUserContactBtnDisabled) {
      this.showUserContactBtnDisabled = true
      const userShell = this.mineUser.shell
      if (userShell >= 10) {
        UniUtil.action('是否消耗10个贝壳查看用户：' + this.userProp.nickname + ' 的联系方式').then(() => {
          UserAPI.getUserContactAPI(this.userProp.id).then((res) => {
            this.userProp.contactAccount = res.data
            this.userProp.showUserContact = true
            this.mineUser.shell = userShell - 10
          })
        }).finally(() => {
          this.showUserContactBtnDisabled = false
        })
      } else {
        UniUtil.action('您没有贝壳了，是否直接使用现金支付').then(() => {
          PlatformUtils.shellPay(1).then(() => {
            UserAPI.getUserContactAPI(this.userProp.id).then((res) => {
              this.userProp.contactAccount = res.data
              this.userProp.showUserContact = true
            }).catch(() => {
              MsgUtil.sysErrMsg()
            })
          })
        }).finally(() => {
          this.showUserContactBtnDisabled = false
        })
      }
    } else {
      UniUtil.toast('获取中，请稍等')
    }
  }


  openReportDialog () {
    if (this.userProp) {
      this.$refs.reportDialog.open()
    } else {
      BalaBala.unLoginMessage()
    }
  }

  frontDeleteUserImg () {
    this.userProp.imgs.splice(this.imgIndex, 1)
  }

  reportTypeChange ({ target }) {
    this.reportType = target.value
  }

  addReport () {
    const reportAdd: ReportAddVO = new ReportAddVO(this.reportContentType, this.reportType, this.reportContent)
    const userImg: ImgFileVO = this.userProp.imgs[0]
    reportAdd.userImgId = userImg.id
    if (ReportType.other === this.reportType && !this.reportContent) {
      UniUtil.hint('选择其他违规时，请您补充观点')
    } else {
      ReportAPI.addReportAPI(reportAdd).then((res: any) => {
        // todo  举报过后，是否大于系统阀值，大于系统阀值隐藏
        const reportNum: number = userImg.reportNum + 1
        if (reportNum >= this.reportHideCount) {
          this.frontDeleteUserImg()
        }
        this.closeDialogAndInitData()
        UniUtil.hint(res.data)
        PlatformUtils.requestSubscribeReport()
      })
    }
  }

  closeDialogAndInitData () {
    this.$refs.reportDialog.close()
    this.initReportData()
  }

  initReportData () {
    this.imgIndex = 0
    this.reportContent = ''
    this.reportType = ReportType.pornInfo
  }

  get bottomMenuItemList () {
    if (this.isMine) {
      return ['上传', '删除']
    } else {
      return ['举报']
    }
  }

  showBottomMenuClick (imgIndex: number) {
    this.imgIndex = imgIndex
    UniUtil.actionSheet(this.bottomMenuItemList).then((index: number) => {
      if (this.isMine) {
        if (index === 0) {
          this.chooseImg()
        } else if (index === 1) {
          this.deleteImg()
        }
      } else {
        if (index === 0) {
          this.openReportDialog()
        }
      }
    })
  }

  created () {
    this.queryMineTalks()
  }

  deleteImg () {
    if (this.userProp.imgs.length > 1) {
      UniUtil.warning('请确认是否删除照片？').then(() => {
        const imgs: ImgFileVO[] = this.userProp.imgs.splice(this.imgIndex, 1)
        UserAPI.deleteUserImgAPI(imgs[0]).then((res: any) => {
          UserStore.setMineUser(res.data)
        })
      })
    } else {
      UniUtil.error('请至少保留一张照片')
    }
  }

  chooseImg () {
    if (this.mineUser.imgs.length > 2) {
      UniUtil.error('最多上传3张照片，请删除后继续！')
      return
    }
    uni.chooseImage({
      sourceType: ['album'],
      sizeType: ['original'],
      // sizeType: ['compressed'],
      count: 1,
      success: (res) => {
        const imgFile: ImgFileVO = res.tempFiles[0]
        // 不能大于10m大于10m就压缩不到100k
        const imgSize: number = imgFile.size
        if (imgSize / 1024 / 1024 > 10) {
          UniUtil.error('图片大小不能超过10MB！')
          return
        }
        UniUtil.showLoading('上传中')
        // 获取文件名
        // 朝着100kb压缩？
        uni.getImageInfo({
          src: imgFile.path,
          success: (image) => {
            imgFile.aspectRatio = image.width / image.height
            // user/id/talk/24324.img
            imgFile.src = ImgUtil.getUserImgUploadFormat(this.userProp.id, imgFile.path)
            CosUtil.postObject(imgFile).then(() => {
              UserAPI.addUserImgAPI(imgFile).then((res: any) => {
                UserStore.setMineUser(res.data)
              }).finally(() => {
                UniUtil.hideLoading()
              })
            })
          }
        })
      }
    })
  }

  getPhoneNumberAfterHandler (loginData: LoginDataVO) {
    return LoginAPI.bindPhoneNumAPI(loginData).then((res: any) => {
      UserStore.setMineUser(res.data.user)
      UniUtil.hint(res.data.hint)
    })
  }

  //微信绑定手机号使用
  getPhoneNumberByLogin (obj: any) {
    LoginService.getLoginData(systemModule.provider).then((loginData: LoginDataVO) => {
      Object.assign(loginData, obj.detail)
      // 代表已过期
      loginData.sessionEnable = false
      this.getPhoneNumberAfterHandler(loginData).finally(() => {
        this.phoneBtnDisabled = false
      })
    })
  }

  toPhonePage () {
    PageUtil.toPhonePage()
  }

  toIdentityAuth () {
    PageUtil.toIdentityAuthPage()
  }

  // 微信点击按钮，获取手机号用来绑定
  getPhoneNumberByWx (obj: any) {
    if (obj.detail.errMsg === 'getPhoneNumber:ok') {
      this.phoneBtnDisabled = true
      // 默认未过期
      LoginUtil.checkSession().then(() => {
        const loginData: LoginDataVO = new LoginDataVO()
        Object.assign(loginData, obj.detail)
        loginData.sessionEnable = true
        this.getPhoneNumberAfterHandler(loginData)
          .then(() => {
            this.phoneBtnDisabled = false
          })
          .catch((error) => {
            if (error.errorCode === ErrorCode.custom) {
              this.getPhoneNumberByLogin(obj)
            } else {
              this.phoneBtnDisabled = false
            }
          })
      }).catch(() => {
        this.getPhoneNumberByLogin(obj)
      })
    } else {
      UniUtil.toast('您选择了不绑定')
    }
  }

  openVip () {
    PageUtil.toVipPage()
  }

  get isMine (): boolean {
    // 两个都有值，且两个都相等，才为自己
    return this.userProp && this.mineUser && this.userProp.id === this.mineUser.id
  }

  get talkIds () {
    if (this.talks.length) {
      return this.talks.map(item => item.id)
    }
    return [0]
  }

  copyText (textCopy: string) {
    UniUtil.textCopy(textCopy)
  }

  deleteTalk (talkId: number) {
    this.talks.splice(this.talks.findIndex(talk => talk.id === talkId), 1)
  }

  closeUserEditPop () {
    this.$refs.editPopup.close()
  }

  moreAction () {
    if (this.isMine) {
      const menuList: string [] = ['刷新', '编辑', '退出']
      UniUtil.actionSheet(menuList).then((index: number) => {
        if (index === 0) {
          this.refreshMine()
        } else if (index === 1) {
          this.openEditDialog()
        } else if (index === 2) {
          this.loginOut()
        }
      })
    }
  }

  /*mounted () {
    this.openEditDialog()
  }*/

  openEditDialog () {
    this.$refs.editPopup.open()
  }

  @Watch('user')
  watchUserChange (newUser: UserVO, oldUser: UserVO) {
    this.phoneBtnDisabled = false
    // 如果以前是null才查询
    if (!oldUser) {
      this.queryMineTalks()
    }
  }

  queryMineTalks () {
    if (this.userProp) {
      this.followStatus = this.userProp.followStatus
      this.hasFollowed = this.userProp.hasFollowed
      TalkAPI.queryUserTalksAPI(this.userProp.id, this.talkIds).then((res: any) => {
        this.talks = res.data
      })
    }
  }

  getGenderIcon (user: UserVO) {
    return UserUtil.getGenderIcon(user)
  }

  getGenderBgColor (user: UserVO) {
    return UserUtil.getGenderBgColor(user)
  }

  toFollowVue () {
    if (this.isMine) {
      PageUtil.navigateTo(PagePath.userFollow)
    }
  }

  toLoveValuePage () {
    if (this.mineUser) {
      PageUtil.toLoveValuePage()
    } else {
      BalaBala.unLoginMessage()
    }
  }

  hintJusticeInfo () {
    UniUtil.toastLong('正义值，正确举报会增加正义值')
  }

  hintBindTwice () {
    UniUtil.hint('因本软件系统升级导致老用户绑定手机号需要操作两次，给您带来不便，我们在此致以歉意，望您能够谅解，我们会努力做的更好，谢谢您的支持')
  }

  addFollow () {
    if (this.mineUser) {
      if (!this.followBtnDisabled) {
        this.followBtnDisabled = true
        const followAdd: FollowAddVO = new FollowAddVO(this.userProp.id)
        // 如果已经关注
        if (this.followStatus === FollowStatus.follow) {
          this.hasFollowed = true
          if (this.userProp.beFollow) {
            // 进行关注操作
            this.followStatus = FollowStatus.eachFollow
          } else {
            this.followStatus = FollowStatus.followed
          }
          FollowAPI.addFollowAPI(followAdd).finally(() => {
            this.followBtnDisabled = false
          })
        } else {
          this.hasFollowed = false
          this.followStatus = FollowStatus.follow
          // 进行取消关注操作
          FollowAPI.cancelFollowAPI(followAdd).finally(() => {
            this.followBtnDisabled = false
          })
        }
      }
    } else {
      BalaBala.unLoginMessage()
    }
  }

  getFollowStatusColor (followStatus: string) {
    return UserUtil.getFollowStatusColor(followStatus)
  }

  toFaceValuePage () {
    PageUtil.toFaceValuePage()
  }

  get imgUrls () {
    if (this.userProp && this.userProp.imgs) {
      return this.userProp.imgs.map(item => ImgUtil.getUserLargeImgUrl(item.src))
    } else {
      return []
    }
  }

  previewImage (e) {
    const current = e.target.dataset.src
    uni.previewImage({
      current: current,
      urls: this.imgUrls
    })
  }

  closeUploadImgHint () {
    this.showUploadImgHint = false
    uni.setStorageSync(Constants.showUploadImgHintKey, 'false')
  }

  refreshMine () {
    UniUtil.action('是否刷新用户信息').then(() => {
      UserStore.getMineUserAction().then(() => {
        UniUtil.toast('刷新成功')
      })
    })
  }

  loginOut () {
    UniUtil.action('是否退出登录').then(() => {
      UserStore.loginOut()
    })
  }

  //前往贝壳页面
  toUserShell () {
    PageUtil.toShellPage()
  }

  switchOpenContact (openContact) {
    let actionMsg
    let hintMsg
    if (openContact) {
      actionMsg = '是否确定展示联系方式'
      hintMsg = '展示成功'
    } else {
      actionMsg = '是否确定隐藏联系方式'
      hintMsg = '隐藏成功'
    }
    UniUtil.action(actionMsg).then(() => {
      UserAPI.switchUserContactAPI(openContact).then(() => {
        UniUtil.toast(hintMsg)
      }).catch(() => {
        this.userProp.openContact = !openContact
      })
    })
  }
}
</script>
