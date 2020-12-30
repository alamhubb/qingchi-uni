<template>
  <view class="line-height-1 elevation-4 radius mb-8px pb-4px bg-white">
    <image class="radius max-h600rpx"
           mode="aspectFill" :style="{'height':user.imgs[0].height+'rpx'}"
           :src="getSmallUserImg(user.imgs[0].src)"
           @click="showUserChange(user)"></image>
    <view class="px-10px">
      <view class="row-between" @click="showUserChange(user)">
        <view class="row-col-center" :class="{'text-red':user.vipFlag}">
          {{user.nickname}}
        </view>
        <view class="row-col-center">
          <q-icon size="32" icon="mdi-circle-medium" :class="[getOnlineColor(user)]"></q-icon>
          <span v-if="user.onlineFlag" class="text-gray ml-3px text-sm">在线</span>
          <span v-else class="text-gray ml-3px text-sm">{{user.lastOnlineTime|formatTime}}</span>
        </view>
      </view>
      <view class="row-between">
        <view>
          <!--                展示列表和你喜欢的-->
          <!--                颜值只用来规范你能不能喜欢人家，你可以看到所有人，简单点来，先只算颜值，啥也不按 就按时间排序，在线时间-->
          <!--                年龄vip分数-->
          <view class="cu-tag sm radius text-sm"
                :class="[getGenderBgColor(user)]">
            {{user.age}}
            <q-icon class="row-col-start ml-2px" size="24"
                    :icon="getGenderIcon(user)"/>
          </view>
          <view v-if="user.vipFlag" class="cu-tag radius bg-red sm text-sm text-bold" @click="openVip">VIP
          </view>
          <view class="cu-tag bg-orange radius sm text-sm" @click.stop="toFaceValuePage">
            颜值:{{user.faceRatio}}
          </view>
        </view>
        <view>
          <q-icon addClass="mdi-rotate-90" size="24" icon="more-dot-fill" @click="openReportDialog"></q-icon>
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
                <label class="mr-sm" :for="report">
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
          <button class="uni-tip-button w40r" type="default" @click="closeDialogAndInitData" :plain="true">
            取消
          </button>
          <button class="uni-tip-button w40r" type="primary" @click="addReport" :disabled="!reportType">
            确定
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import UserVO from '@/model/user/UserVO'
import { namespace } from 'vuex-class'
import PageUtil from '@/utils/PageUtil'
import UserUtil from '@/utils/UserUtil'
import UniUtil from '@/utils/UniUtil'
import ReportContentType from '@/const/ReportContentType'
import ReportType from '@/const/ReportType'
import ReportAddVO from '@/model/report/ReportAddVO'
import ReportAPI from '@/api/ReportAPI'
import ImgFileVO from '@/model/ImgFileVO'
import ImgUtil from '@/utils/ImgUtil'
import BalaBala from '@/utils/BalaBala'
import ConfigMap from '@/const/ConfigMap'
import PlatformUtils from '@/utils/PlatformUtils'

const appStore = namespace('app')
const configStore = namespace('config')

@Component
export default class MatchItem extends Vue {
  public $refs!: {
    reportDialog: any;
  }

  @configStore.Getter(ConfigMap.reportHideCountKey) reportHideCount: number
  @appStore.State('reportTypes') reportTypes: string[]
  @Prop() user: UserVO
  readonly reportContentType: string = ReportContentType.userImg
  reportType: string = ReportType.pornInfo
  pornInfo: string = ReportType.pornInfo
  reportContent = ''

  @Emit('showUser')
  showUserChange () {
    return this.user
  }

  getSmallUserImg (src: string) {
    return ImgUtil.getUserSmallImgUrl(src)
  }

  getGenderIcon (user: UserVO) {
    return UserUtil.getGenderIcon(user)
  }

  getGenderBgColor (user: UserVO) {
    return UserUtil.getGenderBgColor(user)
  }

  getOnlineColor (user: UserVO) {
    return UserUtil.getOnlineColor(user)
  }

  toFaceValuePage () {
    PageUtil.toFaceValuePage()
  }

  openReportDialog () {
    if (this.user) {
      this.$refs.reportDialog.open()
    } else {
      BalaBala.unLoginMessage()
    }
  }

  @Emit('deleteMatchUser')
  deleteMatchUser () {
    return this.user.id
  }

  reportTypeChange ({ target }) {
    this.reportType = target.value
  }

  addReport () {
    const reportAdd: ReportAddVO = new ReportAddVO(this.reportContentType, this.reportType, this.reportContent)
    const userImg: ImgFileVO = this.user.imgs[0]
    reportAdd.userImgId = userImg.id
    if (ReportType.other === this.reportType && !this.reportContent) {
      UniUtil.hint('选择其他违规时，请您补充观点')
    } else {
      ReportAPI.addReportAPI(reportAdd).then((res: any) => {
        const reportNum: number = userImg.reportNum + 1
        if (reportNum >= this.reportHideCount) {
          this.deleteMatchUser()
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
    this.reportContent = ''
    this.reportType = ReportType.pornInfo
  }

  openVip () {
    PageUtil.toVipPage()
  }
}
</script>
