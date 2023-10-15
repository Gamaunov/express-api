import { blogsCollection, commentsCollection } from '../db/db'
import { CommentViewModel, MappedCommentModel } from '../models'
import { commentMapper } from '../shared'

export const commentsRepository = {
  async createComment(
    newComment: CommentViewModel,
  ): Promise<MappedCommentModel> {
    const res = await commentsCollection.insertOne({ ...newComment })

    return commentMapper({ ...newComment, _id: res.insertedId })
  },

  async deleteAllComments() {
    try {
      await blogsCollection.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
