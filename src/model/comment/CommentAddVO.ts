import CommentVO from '@/model/comment/CommentVO'

export default class CommentAddVO {
  public content: string
  public talkId: number
  public commentId: number
  public replyCommentId: number

  constructor (content: string, talkId: number) {
    this.content = content
    this.talkId = talkId
  }

  public toComment (): CommentVO {
    const comment: CommentVO = new CommentVO()
    comment.content = this.content
    return comment
  }
}
