import { inject, injectable } from 'inversify'
import { ObjectId } from 'mongodb'

import {
  CommentDBModel,
  CommentViewModel,
  CommentatorInfoModel,
  CreateCommentModel,
  MappedCommentModel,
} from '../models'
import { CommentsRepository } from '../reposotories/comments-repository'
import { PostsQueryRepository } from '../reposotories/query-repositories/posts-query-repository'
import { LikeStatus } from '../shared'
import { UsersService } from './users-service'

@injectable()
export class CommentsService {
  constructor(
    @inject(UsersService) protected usersService: UsersService,
    @inject(PostsQueryRepository)
    protected postsQueryRepository: PostsQueryRepository,
    @inject(CommentsRepository)
    protected commentsRepository: CommentsRepository,
  ) {}
  async updateComment(id: string, content: string): Promise<boolean> {
    return await this.commentsRepository.updateComment(id, content)
  }

  async updateLikeStatus(
    commentId: string,
    likeStatus: string,
    userId: ObjectId,
  ): Promise<boolean> {
    const foundComment =
      await this.commentsRepository.findCommentById(commentId)

    if (!foundComment) return false

    let likesCount: number = foundComment.likesInfo.likesCount
    let dislikesCount: number = foundComment.likesInfo.dislikesCount

    const foundUser: CommentDBModel | null =
      await this.commentsRepository.findUserByCommentIdAndUserId(
        commentId,
        userId,
      )

    if (!foundUser) {
      await this.commentsRepository.pushUserInLikesInfo(
        commentId,
        userId,
        likeStatus,
      )

      if (likeStatus === LikeStatus.like) {
        likesCount++
      }

      if (likeStatus == LikeStatus.dislike) {
        dislikesCount++
      }
      return this.commentsRepository.updateLikesCount(
        commentId,
        likesCount,
        dislikesCount,
      )
    }

    let userLikeDBStatus: string | null =
      await this.commentsRepository.findUserLikeStatus(commentId, userId)

    switch (userLikeDBStatus) {
      case LikeStatus.none:
        if (likeStatus === LikeStatus.like) {
          likesCount++
        }

        if (likeStatus === LikeStatus.dislike) {
          dislikesCount++
        }

        break

      case LikeStatus.like:
        if (likeStatus === LikeStatus.none) {
          likesCount--
        }

        if (likeStatus === LikeStatus.dislike) {
          likesCount--
          dislikesCount++
        }
        break

      case LikeStatus.dislike:
        if (likeStatus === LikeStatus.none) {
          dislikesCount--
        }

        if (likeStatus === LikeStatus.like) {
          dislikesCount--
          likesCount++
        }
    }

    await this.commentsRepository.updateLikesCount(
      commentId,
      likesCount,
      dislikesCount,
    )

    return this.commentsRepository.updateLikesStatus(
      commentId,
      userId,
      likeStatus,
    )
  }

  async createCommentByPostId(
    postId: string,
    userInfo: CommentatorInfoModel,
    data: CreateCommentModel,
  ): Promise<MappedCommentModel> {
    const newComment: CommentDBModel = new CommentDBModel(
      new ObjectId(),
      data.content,
      { userId: userInfo.userId.toString(), userLogin: userInfo.userLogin },
      postId,
      new Date().toISOString(),
      {
        likesCount: 0,
        dislikesCount: 0,
        users: [],
      },
    )

    return await this.commentsRepository.createComment(newComment)
  }

  async deleteComment(id: string): Promise<boolean> {
    return this.commentsRepository.deleteComment(id)
  }

  async deleteAllComments(): Promise<boolean> {
    return this.commentsRepository.deleteAllComments()
  }
}
