import { VuexModule, Module, Action } from 'vuex-class-modules'
import { userModule } from './index'
import CommentAddVO from '@/model/comment/CommentAddVO'
import CommentVO from '@/model/comment/CommentVO'
import TalkAPI from '@/api/TalkAPI'
import TalkVO from '@/model/talk/TalkVO'
import BalaBala from '@/utils/BalaBala'
import UniUtil from '@/utils/UniUtil'
import TalkTabVO from '@/model/talk/TalkTabVO'
import TalkVueUtil from '@/utils/TalkVueUtil'
import TalkFilterUtil from '@/utils/TalkFilterUtil'

@Module({ generateMutationSetters: true })
export default class TalkModule extends VuexModule {
  // filter内容
  userMinAge: number = TalkFilterUtil.getMinAgeFilter()
  userMaxAge: number = TalkFilterUtil.getMaxAgeFilter()
  userGender: string = TalkFilterUtil.getGenderFilter()

  talkTabs: TalkTabVO [] = TalkVueUtil.getTalkTabs()

  // state
  currentContent: null
  talk: TalkVO = null
  comment: CommentVO = null
  replyComment: CommentVO = null
  inputContentFocus = false

  // talk和评论的举报删除相关操作的dialog的显示
  commentActionShow = false
  reportDialogShow = false
  reportContentType = ''

  @Action
  addComment ({ content }) {
    // 使输入框失去焦点，隐藏
    const commentAdd: CommentAddVO = new CommentAddVO(content, this.talk.id)
    const tempComment: CommentVO = commentAdd.toComment()
    tempComment.user = userModule.user
    if (this.comment) {
      commentAdd.commentId = this.comment.id
      if (this.replyComment) {
        commentAdd.replyCommentId = this.replyComment.id
        tempComment.replyComment = this.replyComment
      }
    }
    if (this.comment) {
      this.comment.childComments.unshift(tempComment)
      this.comment.childCommentNum++
    } else {
      this.talk.comments.unshift(tempComment)
      this.talk.commentNum++
    }
    TalkAPI.addCommentAPI(commentAdd).then((res: any) => {
      if (this.comment) {
        this.comment.childComments.splice(0, 1, res.data)
      } else {
        this.talk.comments.splice(0, 1, res.data)
      }
    })
  }

  @Action
  setTalk (talk) {
    if (userModule.user) {
      this.talk = talk
      this.comment = null
      this.replyComment = null
      this.currentContent = talk.content
      this.inputContentFocusEvent()
    } else {
      BalaBala.unLoginMessage()
    }
  }

  @Action
  setComment ({ talk, comment }) {
    if (userModule.user) {
      this.talk = talk
      this.comment = comment
      this.replyComment = null
      this.currentContent = comment.content
      this.inputContentFocusEvent()
    } else {
      BalaBala.unLoginMessage()
    }
  }

  @Action
  setReplyComment ({ talk, comment, replyComment }) {
    if (userModule.user) {
      this.talk = talk
      this.comment = comment
      this.replyComment = replyComment
      this.currentContent = replyComment.content
      this.inputContentFocusEvent()
    } else {
      BalaBala.unLoginMessage()
    }
  }

  @Action
  inputContentFocusEvent () {
    // 需要有延迟，要不然无法成功切换
    UniUtil.delayTime(200).then(() => {
      this.inputContentFocus = true
    })
  }

  @Action
  inputContentBlur () {
    // 需要有延迟，要不然无法触发按钮事件
    UniUtil.delayTime(100).then(() => {
      this.inputContentFocus = false
    })
  }
}
