import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { CommentsService } from '../application/comments.service'
import { CommentsQueryRepository } from '../infrastructure/query/comments.query.repository'
import {
  CommentViewModel,
  CreateCommentModel,
  URIParamsBlogModel,
  URIParamsCommentIdModel,
  URIParamsIdModel,
} from '../models'
import {
  LikeStatusType,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../shared'

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryRepository)
    protected commentsQueryRepository: CommentsQueryRepository,
    @inject(CommentsService) protected commentsService: CommentsService,
  ) {}

  async getComment(
    req: RequestWithParams<URIParamsIdModel>,
    res: Response,
  ): Promise<void> {
    const comment: CommentViewModel | null =
      await this.commentsQueryRepository.getCommentById(
        req.params.id,
        req.user?._id,
      )

    comment ? res.status(200).json(comment) : res.sendStatus(404)
  }

  async updateComment(
    req: RequestWithParamsAndBody<URIParamsBlogModel, CreateCommentModel>,
    res: Response,
  ) {
    if (!req.user) return res.sendStatus(401)

    const comment: CommentViewModel | null =
      await this.commentsQueryRepository.getCommentById(req.params.id)

    if (!comment) return res.sendStatus(404)

    if (
      comment?.commentatorInfo.userId.toString() === req.user._id.toString()
    ) {
      const isUpdated: boolean = await this.commentsService.updateComment(
        req.params.id,
        req.body.content,
      )

      return isUpdated ? res.sendStatus(204) : res.sendStatus(404)
    } else {
      return res.sendStatus(403)
    }
  }

  async updateLikeStatus(
    req: RequestWithParamsAndBody<URIParamsCommentIdModel, LikeStatusType>,
    res: Response,
  ) {
    const isUpdated: boolean = await this.commentsService.updateLikeStatus(
      req.params.commentId,
      req.body.likeStatus,
      req.user!._id,
    )

    if (isUpdated) {
      const updatedComment: CommentViewModel | null =
        await this.commentsQueryRepository.getCommentById(req.params.commentId)

      res.status(204).json(updatedComment)
    }
  }

  async deleteComment(
    req: RequestWithParams<URIParamsCommentIdModel>,
    res: Response,
  ) {
    if (!req.user) return res.sendStatus(401)

    const comment: CommentViewModel | null =
      await this.commentsQueryRepository.getCommentById(req.params.commentId)

    if (!comment) return res.sendStatus(404)

    if (comment.commentatorInfo.userId.toString() === req.user._id.toString()) {
      const isDeleted: boolean = await this.commentsService.deleteComment(
        req.params.commentId,
      )

      return isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    } else {
      return res.sendStatus(403)
    }
  }

  async deleteAllComments(req: Request, res: Response) {
    const isDeleted = await this.commentsService.deleteAllComments()
    isDeleted ? res.sendStatus(204) : res.sendStatus(404)
  }
}
