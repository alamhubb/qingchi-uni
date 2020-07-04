<template>
  <uni-popup ref="reportDialog" :custom="true" :mask-click="false">
    <view class="uni-tip">
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
      <view class="uni-textarea bd-1 bd-radius">
        <textarea placeholder="其他违规必填，其他情况选填，可详细陈述观点" v-model.trim="reportContent"
                  :show-confirm-bar="false"
        />
      </view>
      <view class="uni-tip-group-button">
        <button class="uni-tip-button w40r" type="default" @click="closeDialogAndInitData" :plain="true">取消
        </button>
        <button class="uni-tip-button w40r" type="primary" @click="addReport" :disabled="!reportType">确定
        </button>
      </view>
    </view>
  </uni-popup>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import ReportType from '@/const/ReportType'
import ReportContentType from '@/const/ReportContentType'
import MessageVO from '@/model/message/MessageVO'
import ReportAddVO from '@/model/report/ReportAddVO'
import UniUtils from '@/utils/UniUtils'
import ReportAPI from '@/api/ReportAPI'
import UserVO from '@/model/user/UserVO'
import BalaBala from '@/utils/BalaBala'
import { chatModule } from '@/plugins/store'
import PlatformUtils from '@/utils/PlatformUtils'

const appStore = namespace('app')
const userStore = namespace('user')

  @Component
export default class ReportDialog extends Vue {
    public $refs!: {
      reportDialog: any;
    }

    @appStore.State('reportTypes') reportTypes: string[]
    @appStore.State('appConfig') readonly appConfig: object
    @Prop() readonly reportInfo: MessageVO
    @Prop() readonly reportInfoType: string
    @userStore.State('user') user: UserVO
    reportType: string = ReportType.pornInfo
    pornInfo: string = ReportType.pornInfo
    reportContent = ''
    reportContentType: string = ReportContentType.message

    openReport () {
      if (this.user) {
        this.$refs.reportDialog.open()
      } else {
        BalaBala.unLoginMessage()
      }
    }

    closeDialogAndInitData () {
      this.$refs.reportDialog.close()
      this.initReportData()
    }

    initReportData () {
      this.reportContent = ''
      this.reportContentType = ReportContentType.message
      this.reportType = ReportType.pornInfo
    }

    reportTypeChange ({ target }) {
      this.reportType = target.value
    }

    addReport () {
      const reportAdd: ReportAddVO = new ReportAddVO(this.reportContentType, this.reportType, this.reportContent)
      reportAdd.messageId = this.reportInfo.id
      if (ReportType.other === this.reportType && !this.reportContent) {
        UniUtils.hint('选择其他违规时，请您补充观点')
      } else {
        ReportAPI.addReportAPI(reportAdd).then((res: any) => {
          chatModule.deleteMsgAction(reportAdd.messageId)
          // 调用删除内容
          // 关闭弹框病初始化数据
          this.closeDialogAndInitData()
          UniUtils.hint(res.data)
          PlatformUtils.requestSubscribeReport()
        })
      }
    }
}
</script>
