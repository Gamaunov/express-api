import { ObjectId } from 'mongodb'

import {
  CommentQueryModel,
  MappedCommentModel,
  PaginatorCommentModel,
} from '../../models'
import { Comments } from '../../schemas/commentSchema'
import { commentMapper, queryCommentValidator, skipFn } from '../../shared'

export const commentsQueryRepository = {
  async getCommentsByPostId(
    postId: string,
    data: CommentQueryModel,
  ): Promise<PaginatorCommentModel | null> {
    const queryData: CommentQueryModel = queryCommentValidator(data)

    try {
      const filter = { postId }

      const sortCriteria: { [key: string]: any } = {
        [queryData.sortBy as string]: queryData.sortDirection,
      }

      const skip: number = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize

      const comments = await Comments.find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)

      const commentItems: MappedCommentModel[] = comments.map((c) =>
        commentMapper(c),
      )

      const totalCount: number = await Comments.countDocuments(filter)

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
    const foundComment = await Comments.findOne({ _id: new ObjectId(id) })

    if (!foundComment) return null

    return commentMapper(foundComment)
  },
}
