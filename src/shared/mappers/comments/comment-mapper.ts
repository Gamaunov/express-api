import { CommentViewModel, MappedCommentModel } from '../../../models'

export const commentMapper = (
  comment: CommentViewModel,
): MappedCommentModel => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
  }
}
