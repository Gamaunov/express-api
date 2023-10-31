import { ObjectId } from 'mongodb'

import {
  CommentViewModel,
  CommentatorInfoModel,
  CreateCommentModel,
  MappedCommentModel,
} from '../models'
import { commentsRepository } from '../reposotories/comments-repository'

export const commentsService = {
  async updateComment(id: string, content: string): Promise<boolean> {
    return await commentsRepository.updateComment(id, content)
  },

  async createCommentByPostId(
    postId: string,
    userInfo: CommentatorInfoModel,
    data: CreateCommentModel,
  ): Promise<MappedCommentModel> {
    const newComment: CommentViewModel = {
      _id: new ObjectId(),
      postId,
      content: data.content,
      commentatorInfo: {
        userId: userInfo.userId.toString(),
        userLogin: userInfo.userLogin,
      },
      createdAt: new Date().toISOString(),
    }

    return await commentsRepository.createComment(newComment)
  },

  async deleteComment(id: string): Promise<boolean> {
    return commentsRepository.deleteComment(id)
  },
}
