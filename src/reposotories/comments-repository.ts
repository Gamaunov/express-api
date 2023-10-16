import { ObjectId } from 'mongodb'

import { commentsCollection } from '../db/db'
import {
  CommentQueryModel,
  CommentViewModel,
  MappedCommentModel,
  PaginatorCommentModel,
} from '../models'
import { commentMapper, skipFn } from '../shared'

export const commentsRepository = {
  async createComment(
    newComment: CommentViewModel,
  ): Promise<MappedCommentModel> {
    const res = await commentsCollection.insertOne({ ...newComment })

    return commentMapper({ ...newComment, _id: res.insertedId })
  },

  async getCommentsByPostId(
    postId: string,
    queryData: CommentQueryModel,
  ): Promise<PaginatorCommentModel | null> {
    try {
      const filter = { postId: postId }

      const sortCriteria: { [key: string]: any } = {
        [queryData.sortBy as string]: queryData.sortDirection,
      }

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize

      const comments = await commentsCollection
        .find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)
        .toArray()

      const commentItems = comments.map((c) => commentMapper(c))

      const totalCount = await commentsCollection.countDocuments(filter)

      return {
        pagesCount: Math.ceil(totalCount / queryData.pageSize!),
        page: queryData.pageNumber!,
        pageSize: queryData.pageSize!,
        totalCount: totalCount,
        items: commentItems,
      }
    } catch (e) {
      console.log(e)
      return null
    }
  },

  async getCommentById(id: string): Promise<MappedCommentModel | null> {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) })

    if (!comment) return null

    return commentMapper(comment)
  },

  async updateComment(
    id: string,
    content: string,
  ): Promise<MappedCommentModel | null> {
    const comment = await commentsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { content } },
    )

    if (!comment) return null

    return commentMapper(comment)
  },

  async deleteAllComments() {
    try {
      await commentsCollection.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },

  async deleteComment(id: string): Promise<boolean> {
    const isCommentDeleted = await commentsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    return isCommentDeleted.deletedCount === 1
  },
}
