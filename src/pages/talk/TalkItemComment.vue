<template>
    <view>
        <view class="card-actions pt-10px row-between">
            <view class="row-end flex-auto">
                <view class="flex-row button-icon" @click="setTalk" hover-class="uni-list-cell-hover">
                    <q-icon icon="mdi-comment-outline" size="42">
                    </q-icon>
                    <text v-if="talk.commentNum" class="ml-5px">
                        {{talk.commentNum}}
                    </text>
                </view>
            </view>
            <view class="row-end flex-auto">
                <!--                hover-class="uni-list-cell-hover"-->
                <view class="row-all-center">
                    <view @click="addHug" class="text-df line-height-1 row-all-center px-0 border-none bg-white">
                        <text class="text-df">
                            抱抱
                        </text>
                        <q-icon class="ml-5px"
                                size="42"
                                :icon="getHugIcon(talk.hasHugged)"
                                :class="[getHugColor(talk.hasHugged)]"
                        ></q-icon>
                        <text v-if="talk.hugNum" class="ml-5px">
                            {{talk.hugNum}}
                        </text>
                    </view>
                </view>
                <view class="ml-30px button-icon" @click="openReportDialog"
                      hover-class="uni-list-cell-hover">
                    <q-icon icon="more-dot-fill" size="42"></q-icon>
                </view>
            </view>
        </view>
        <view class="card-text">
            <view class="flex-auto" v-if="talk.comments">
                <block v-for="(comment,index) in talk.comments" :key="comment.id">
                    <view v-if="index < commentShowNum">
                        <!--                        {{comment.no}}#-->
                        <view class="flex-row" @click="toTalkDetailVue">
                            <view class="flex-none" :class="comment.user.vipFlag?'text-red':'font-blue-deep'"
                                  @click.stop="toUserDetail(comment.user.id)">
                                {{comment.user.nickname}}
                            </view>
                            ：
                            <view @longpress="openCommentActionDialog(comment)"
                                  @click="setComment(talk,comment)">
                                {{comment.content}}
                            </view>
                        </view>
                        <child-comment :talk="talk" :comment-prop="comment"></child-comment>
                    </view>
                </block>
                <view v-show="!showAllComment && (talk.commentNum>commentShowNum || showOtherCommentClicked)">
                    <view class="row-col-center font-orange" @click="toTalkDetailVue">
                        <view v-show="talk.commentNum>commentShowNum">
                            查看其余{{talk.commentNum - commentShowNum}}条评论
                        </view>
                        <view v-show="false">
                            收起评论
                            <q-icon icon="arrow-up" size="42"></q-icon>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import TalkVO from '@/model/talk/TalkVO'
import PagePath from '@/const/PagePath'
import TalkAPI from '@/api/TalkAPI'
import ReportContentType from '@/const/ReportContentType'
import UniUtils from '@/utils/UniUtils'
import HugAddVO from '@/model/HugAddVO'
import ChildComment from '@/pages/talk/ChildComment.vue'
import UserVO from '@/model/user/UserVO'
import { namespace } from 'vuex-class'
import CommentVO from '@/model/comment/CommentVO'
import TalkUtil from '@/utils/TalkUtil'
import PageUtil from '@/utils/PageUtil'
import JsonUtils from '@/utils/JsonUtils'
import { talkModule } from '@/plugins/store'
import BalaBala from '@/utils/BalaBala'

const userStore = namespace('user')

  @Component({
    components: {
      ChildComment
    }
  })
export default class TalkItemComment extends Vue {
    @userStore.State('user') user: UserVO
    // 因为无法直接修改，所以需要克隆一下
    @Prop() readonly talkProp: TalkVO
    @Prop({ type: Boolean, default: false }) readonly showAllComment: boolean

    talk: TalkVO = JsonUtils.deepClone(this.talkProp)

    @Watch('talkProp')
    talkPropWatch () {
      this.talk = JsonUtils.deepClone(this.talkProp)
    }

    // 打开更多操作评论弹框，复制删除，举报
    openCommentActionDialog (comment: CommentVO) {
      talkModule.talk = this.talk
      talkModule.comment = comment
      talkModule.commentActionShow = true
    }

    // 打开举报talk弹框
    openReportDialog () {
      if (this.user) {
        talkModule.talk = this.talk
        talkModule.reportContentType = ReportContentType.talk
        talkModule.reportDialogShow = true
      } else {
        BalaBala.unLoginMessage()
      }
    }

    setTalk () {
      talkModule.setTalk(this.talk)
    }

    addHug () {
      // 登录才可以点赞
      if (this.user) {
        if (this.talk.hasHugged) {
          UniUtils.toast('已抱过不能取消')
          return
        }
        this.talk.hasHugged = true
        this.talk.hugNum++
        const hugAdd: HugAddVO = new HugAddVO(this.talk.id)
        TalkAPI.addHugAPI(hugAdd)
      } else {
        BalaBala.unLoginMessage()
      }
    }

    toUserDetail (userId: number) {
      if (PageUtil.getCurrentPageURI() !== PagePath.userDetail || PageUtil.getCurrentPage().options.userId !== String(userId)) {
        PageUtil.navigateTo(PagePath.userDetail + '?userId=' + userId)
      }
    }

    showOtherCommentClicked = false

    toTalkDetailVue () {
      if (PageUtil.getCurrentPageURI() !== PagePath.talkDetail) {
        PageUtil.navigateTo(PagePath.talkDetail + '?talkId=' + this.talk.id)
      }
    }

    get commentLimitNum () {
      if (this.showAllComment || this.showOtherCommentClicked) {
        return this.talk.commentNum
      } else {
        return 4
      }
    }

    get commentShowNum () {
      return this.talk.commentNum > this.commentLimitNum ? (this.commentLimitNum - 1) : this.commentLimitNum
    }

    setComment (talk, comment) {
      talkModule.setComment({ talk, comment })
    }

    getHugIcon (hasHugged) {
      return TalkUtil.getHugIcon(hasHugged)
    }

    getHugColor (hasHugged) {
      return TalkUtil.getHugColor(hasHugged)
    }
}
</script>
