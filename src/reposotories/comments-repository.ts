import { injectable } from 'inversify'
import { DeleteResult, ObjectId } from 'mongodb'
import { HydratedDocument, UpdateWriteOpResult } from 'mongoose'

import { CommentMongooseModel } from '../domain/CommentSchema'
import { CommentDBModel, CommentViewModel } from '../models'
import { LikeStatus } from '../shared'

@injectable()
export class CommentsRepository {
  async createComment(newComment: CommentDBModel): Promise<CommentViewModel> {
    const comment = await CommentMongooseModel.create(newComment)

    return {
      id: comment._id.toString(),
      content: newComment.content,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin,
      },
      createdAt: newComment.createdAt,
      likesInfo: {
        likesCount: newComment.likesInfo.likesCount,
        dislikesCount: newComment.likesInfo.dislikesCount,
        myStatus: LikeStatus.none,
      },
    }
  }

  async updateComment(id: string, content: string): Promise<boolean> {
    const result: UpdateWriteOpResult = await CommentMongooseModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content } },
    )

    return result.matchedCount === 1
  }

  async findCommentById(
    _id: string,
  ): Promise<HydratedDocument<CommentDBModel> | null> {
    return CommentMongooseModel.findOne({ _id })
  }

  async findUserByCommentIdAndUserId(
    commentId: string,
    userId: ObjectId,
  ): Promise<CommentDBModel | null> {
    const foundUser = await CommentMongooseModel.findOne(
      CommentMongooseModel.findOne({
        _id: commentId,
        'likesInfo.users.userId': userId,
      }),
    )

    return foundUser ? foundUser : null
  }

  async pushUserInLikesInfo(
    commentId: string,
    userId: ObjectId,
    likeStatus: string,
  ): Promise<boolean> {
    const result = await CommentMongooseModel.updateOne(
      { _id: commentId },
      {
        $push: {
          'likesInfo.users': {
            userId,
            likeStatus,
          },
        },
      },
    )

    return result.matchedCount === 1
  }

  async updateLikesCount(
    commentId: string,
    likesCount: number,
    dislikesCount: number,
  ): Promise<boolean> {
    const result = await CommentMongooseModel.updateOne(
      { _id: commentId },
      {
        $set: {
          'likesInfo.likesCount': likesCount,
          'likesInfo.dislikesCount': dislikesCount,
        },
      },
    )

    return result.matchedCount === 1
  }

  async updateLikesStatus(
    commentId: string,
    userId: ObjectId,
    likeStatus: string,
  ): Promise<boolean> {
    const result = await CommentMongooseModel.updateOne(
      { _id: commentId, 'likesInfo.users.userId': userId },
      {
        $set: {
          'likesInfo.users.$.likeStatus': likeStatus,
        },
      },
    )
    return result.matchedCount === 1
  }

  async findUserLikeStatus(
    commentId: string,
    userId: ObjectId,
  ): Promise<string | null> {
    const foundUser = await CommentMongooseModel.findOne(
      { _id: commentId },
      {
        'likesInfo.users': {
          $filter: {
            input: '$likesInfo.users',
            cond: { $eq: ['$$this.userId', userId.toString()] },
          },
        },
      },
    )

    if (!foundUser || foundUser.likesInfo.users.length === 0) {
      return null
    }

    return foundUser.likesInfo.users[0].likeStatus
  }

  async deleteAllComments(): Promise<boolean> {
    await CommentMongooseModel.deleteMany({})
    return (await CommentMongooseModel.countDocuments()) === 0
  }

  async deleteComment(id: string): Promise<boolean> {
    const isCommentDeleted: DeleteResult = await CommentMongooseModel.deleteOne(
      {
        _id: new ObjectId(id),
      },
    )

    return isCommentDeleted.deletedCount === 1
  }
}
