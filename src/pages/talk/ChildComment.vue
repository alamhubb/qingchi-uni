<template>
    <view v-if="comment.childComments" class="pl-15px">
        <block v-for="(childComment,index) in comment.childComments" :key="childComment.id">
            <view v-if="index<childCommentShowNum" class="flex-row">
                <!--            {{childComment.no}}#-->
                <text :class="comment.user.vipFlag?'text-red':'font-blue-deep'" class="row-col-center" @click="toUserDetail(childComment.user.id)">{{childComment.user.nickname}}</text>
                <view class="flex-sub row-col-center" @click="setReplyComment(talk,comment,childComment)">
                    <text v-if="childComment.replyComment">
                        <text class="mx-5px">回复</text>
                        <!--                {{childComment.replyComment.no}}#-->
                        <text class="blue800" @click.stop="toUserDetail(childComment.replyComment.user.id)">
                            {{childComment.replyComment.user.nickname}}
                        </text>
                    </text>
                    ：
                    <text selectable>{{childComment.content}}</text>
                </view>
            </view>
        </block>
        <view v-show="comment.childCommentNum>childCommentShowNum || showOtherCommentClicked" class="pt-2px">
            <view class="font-orange row-col-center" @click="toggleOtherComments">
                <view v-show="comment.childCommentNum>childCommentShowNum">
                    查看其余{{comment.childCommentNum- childCommentShowNum}}条回复
                    <q-icon icon="arrow-down" size="42"></q-icon>
                </view>
                <view v-show="showOtherCommentClicked">
                    收起回复
                    <q-icon icon="arrow-up" size="42"></q-icon>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import TalkVO from '@/model/talk/TalkVO'
import CommentVO from '@/model/comment/CommentVO'
import PagePath from '@/const/PagePath'
import PageUtil from '@/utils/PageUtil'
import { talkModule } from '@/plugins/store'
import JsonUtils from '@/utils/JsonUtils'

  @Component({
    components: {}
  })
export default class ChildComment extends Vue {
    @Prop() readonly talk: TalkVO
    @Prop() readonly commentProp: CommentVO
    comment: CommentVO = JsonUtils.deepClone(this.commentProp)

    @Watch('commentProp')
    commentPropWatch () {
      this.comment = JsonUtils.deepClone(this.commentProp)
    }

    childCommentLimitNum = 3
    showOtherCommentClicked = false

    toggleOtherComments () {
      if (this.showOtherCommentClicked) {
        this.childCommentLimitNum = 3
        this.showOtherCommentClicked = false
      } else {
        this.childCommentLimitNum = this.comment.childCommentNum
        this.showOtherCommentClicked = true
      }
    }

    toUserDetail (userId: number) {
      if (PageUtil.getCurrentPageURI() !== PagePath.userDetail || PageUtil.getCurrentPage().options.userId !== String(userId)) {
        PageUtil.navigateTo(PagePath.userDetail + '?userId=' + userId)
      }
    }

    get childCommentShowNum () {
      return this.comment.childCommentNum > this.childCommentLimitNum ? (this.childCommentLimitNum - 1) : this.childCommentLimitNum
    }

    setReplyComment (talk, comment, replyComment) {
      talkModule.setReplyComment({ talk, comment, replyComment })
    }

    promptDeleteContent () {
      /* if (this.$refs.msgInput.content) {
        this.$info('是否清空已输入内容').then(({result}) => {
          if (result) {
            this.$refs.msgInput.content = ''
          }
        })
      } */
    }
}
</script>
