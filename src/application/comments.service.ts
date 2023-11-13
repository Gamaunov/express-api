import { inject, injectable } from 'inversify'
import { ObjectId } from 'mongodb'

import {
  CommentDBModel,
  CommentViewModel,
  CommentatorInfoModel,
  CreateCommentModel,
} from '../models'
import { CommentsRepository } from '../infrastructure/comments.repository'
import { PostsQueryRepository } from '../infrastructure/query/posts.query.repository'
import { LikeStatus, likeSwitcher } from '../shared'
import { UsersService } from './users.service'

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

    if (!foundComment) {
      return false
    }

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

    const userLikeDBStatus: string | null =
      await this.commentsRepository.findUserLikeStatus(commentId, userId)

    const updatedLikesCount = likeSwitcher(
      userLikeDBStatus,
      likeStatus,
      likesCount,
      dislikesCount,
    )

    await this.commentsRepository.updateLikesCount(
      commentId,
      updatedLikesCount.likesCount,
      updatedLikesCount.dislikesCount,
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
  ): Promise<CommentViewModel> {
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
