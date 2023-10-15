import { CommentViewModel, MappedCommentModel } from '../../../models'

export const commentMapper = (
  comment: CommentViewModel,
): MappedCommentModel => {
  return {
    id: comment._id.toHexString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId.toString(),
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
  }
}
