import { inject, injectable } from 'inversify'
import { ObjectId } from 'mongodb'

import { CommentMongooseModel } from '../../domain/CommentSchema'
import {
  CommentQueryModel,
  MappedCommentModel,
  PaginatorCommentModel,
} from '../../models'
import {
  LikeStatus,
  commentMapper,
  queryCommentValidator,
  skipFn,
} from '../../shared'
import { CommentsRepository } from '../comments-repository'

@injectable()
export class CommentsQueryRepository {
  constructor(
    @inject(CommentsRepository)
    protected commentsRepository: CommentsRepository,
  ) {}
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

      const comments = await CommentMongooseModel.find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)

      const commentItems: MappedCommentModel[] = comments.map((c) =>
        commentMapper(c),
      )

      const totalCount: number =
        await CommentMongooseModel.countDocuments(filter)

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
  }

  async getCommentById(
    _id: string,
    userId?: ObjectId,
  ): Promise<MappedCommentModel | null> {
    const foundComment = await CommentMongooseModel.findOne({
      _id,
    })

    if (!foundComment) return null

    let status
    if (userId) {
      status = await this.commentsRepository.findUserLikeStatus(_id, userId)
    }

    return {
      id: foundComment._id.toString(),
      content: foundComment.content,
      commentatorInfo: {
        userId: foundComment.commentatorInfo.userId,
        userLogin: foundComment.commentatorInfo.userLogin,
      },
      createdAt: foundComment.createdAt,
      likesInfo: {
        likesCount: foundComment.likesInfo.likesCount,
        dislikesCount: foundComment.likesInfo.dislikesCount,
        myStatus: status || LikeStatus.none,
      },
    }
  }
}
