import { MappedCommentModel } from '../models'
import { commentsRepository } from '../reposotories/comments-repository'

export const commentsService = {
  async updateComment(
    id: string,
    content: string,
  ): Promise<MappedCommentModel | null> {
    return await commentsRepository.updateComment(id, content)
  },

  async getCommentById(id: string): Promise<MappedCommentModel | null> {
    return commentsRepository.getCommentById(id)
  },

  async deleteComment(id: string): Promise<boolean> {
    return commentsRepository.deleteComment(id)
  },
}
