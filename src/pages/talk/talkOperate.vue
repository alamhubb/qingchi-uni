<template>
    <view>
        <u-popup :value="commentVisible" border-radius="20" mode="center"
                 @close="commentActionClose">
            <view class="uni-tip w180px">
                <uni-list class="w100px">
                    <uni-list-item :show-arrow="true" title="复制" @click="copyText"/>
                    <uni-list-item v-if="user&&comment&&(user.id === comment.user.id||user.id ===talk.user.id)"
                                   :show-arrow="true" title="删除" @click="userDeleteComment"/>
                    <uni-list-item v-if="user" :show-arrow="true" title="举报"
                                   @click="openReportDialog"/>
                </uni-list>
            </view>
        </u-popup>

        <u-popup :value="dialogVisible" border-radius="20" mode="center"
                 :mask-close-able="false">
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
                    <button class="uni-tip-button w40r" type="default" @click="reportDialogClose" :plain="true">
                        取消
                    </button>
                    <button class="uni-tip-button w40r" type="primary" @click="addReport" :disabled="!reportType">确定
                    </button>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script lang="ts">
import {
  Vue,
  Component
} from 'vue-property-decorator'

import { namespace } from 'vuex-class'

import CommentVO from '@/model/comment/CommentVO'
import ReportType from '@/const/ReportType'
import ReportAddVO from '@/model/report/ReportAddVO'
import ReportContentType from '@/const/ReportContentType'
import ReportAPI from '@/api/ReportAPI'
import TalkAPI from '@/api/TalkAPI'
import UniUtil from '@/utils/UniUtil'
import UserVO from '@/model/user/UserVO'
import { talkModule } from '@/plugins/store'
import TalkVO from '@/model/talk/TalkVO'
import BalaBala from '@/utils/BalaBala'
import ConfigMap from '@/const/ConfigMap'
import PlatformUtils from '@/utils/PlatformUtils'

const appStore = namespace('app')
const userStore = namespace('user')
const talkStore = namespace('talk')
const configStore = namespace('config')
// todo 后台可控制是否显示轮播图

  @Component
export default class TalkOperate extends Vue {
    @appStore.State('appConfig') readonly appConfig: object
    @userStore.State('user') readonly user: UserVO
    @appStore.State('reportTypes') readonly reportTypes: string[]
    @talkStore.State('commentActionShow') readonly commentVisible: boolean
    @talkStore.State('reportDialogShow') readonly dialogVisible: boolean
    @talkStore.State('comment') readonly comment: CommentVO
    @talkStore.State('reportContentType') readonly reportContentType: string
    @talkStore.State('talk') readonly talk: TalkVO

    pornInfo: string = ReportType.pornInfo
    reportType: string = ReportType.pornInfo
    reportContent = ''
    // 被举报次数大于多少，则隐藏
    @configStore.Getter(ConfigMap.reportHideCountKey) reportHideCount: number

    reportDialogClose () {
      talkModule.reportDialogShow = false
      this.initData()
    }

    addReport () {
      const reportAdd: ReportAddVO = new ReportAddVO(this.reportContentType, this.reportType, this.reportContent)
      if (this.reportContentType === ReportContentType.talk) {
        reportAdd.talkId = this.talk.id
      } else {
        reportAdd.commentId = this.comment.id
      }
      if (ReportType.other === this.reportType && !this.reportContent) {
        UniUtil.hint('选择其他违规时，请您补充观点')
      } else {
        ReportAPI.addReportAPI(reportAdd).then((res: any) => {
          if (this.reportContentType === ReportContentType.comment) {
            const reportNum: number = this.comment.reportNum + 1
            if (reportNum >= this.reportHideCount) {
              this.frontDeleteComment()
            }
          } else {
            const reportNum: number = this.talk.reportNum + 1
            if (reportNum >= this.reportHideCount) {
              this.$emit('deleteTalk', this.talk.id)
            }
          }
          // 必须最后清空因为前面还要使用做判断
          this.reportDialogClose()
          UniUtil.hint(res.data)
          PlatformUtils.requestSubscribeReport()
        })
      }
    }

    deleteComment () {
      this.frontDeleteComment()
      TalkAPI.deleteCommentAPI(this.comment.id).then(() => {
        this.initData()
      })
    }

    copyText () {
      UniUtil.textCopy(this.comment.content)
      this.closeActionAndInitData()
    }

    closeActionAndInitData () {
      this.commentActionClose()
      this.initData()
    }

    commentActionClose () {
      talkModule.commentActionShow = false
    }

    // 前端删除comment
    frontDeleteComment () {
      this.talk.comments.splice(this.talk.comments.findIndex(comment => comment.id === this.comment.id), 1)
    }

    // 用户自己删除
    userDeleteComment () {
      this.commentActionClose()
      UniUtil.action('是否确定删除此条评论，此操作无法恢复').then(() => {
        this.deleteComment()
      })
    }

    openReportDialog () {
      if (this.user) {
        this.commentActionClose()
        talkModule.reportContentType = ReportContentType.comment
        talkModule.reportDialogShow = true
      } else {
        BalaBala.unLoginMessage()
      }
    }

    reportTypeChange ({ target }) {
      this.reportType = target.value
    }

    initData () {
      talkModule.talk = null
      talkModule.comment = null
      talkModule.reportContentType = ''
      this.$nextTick(() => {
        this.reportContent = ''
        this.reportType = ReportType.pornInfo
      })
    }
}
</script>
