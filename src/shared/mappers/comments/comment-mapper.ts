import { CommentDBModel, MappedCommentModel } from '../../../models'

export const commentMapper = (
  comment: CommentDBModel,
  status?: string | null | undefined,
): MappedCommentModel => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: typeof status === 'string' ? status : 'None',
    },
  }
}
