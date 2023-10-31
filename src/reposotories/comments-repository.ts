import { DeleteResult, ObjectId } from 'mongodb'
import { UpdateWriteOpResult } from 'mongoose'

import { CommentViewModel, MappedCommentModel } from '../models'
import { Comments } from '../schemas/commentSchema'
import { commentMapper } from '../shared'

export const commentsRepository = {
  async createComment(
    newComment: CommentViewModel,
  ): Promise<MappedCommentModel> {
    const comment = await Comments.create(newComment)

    return commentMapper(comment)
  },

  async updateComment(id: string, content: string): Promise<boolean> {
    const result: UpdateWriteOpResult = await Comments.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content } },
    )

    return result.matchedCount === 1
  },

  async deleteAllComments(): Promise<void> {
    try {
      await Comments.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },

  async deleteComment(id: string): Promise<boolean> {
    const isCommentDeleted: DeleteResult = await Comments.deleteOne({
      _id: new ObjectId(id),
    })

    return isCommentDeleted.deletedCount === 1
  },
}
