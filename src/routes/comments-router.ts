import express, { Response } from 'express'

import { commentsService } from '../domain/comments-service'
import {
  CommentErrorsValidation,
  ValidateComment,
  authBearerMiddleware,
  validateObjectId,
} from '../middlewares'
import {
  CreateCommentModel,
  MappedCommentModel,
  URIParamsBlogIdModel,
  URIParamsCommentIdModel,
} from '../models'
import { commentsQueryRepository } from '../reposotories/query-repositories/comments-query-repository'
import { RequestWithParams, RequestWithParamsAndBody } from '../shared'

export const commentsRouter = () => {
  const router = express.Router()

  router.get(
    `/:id`,
    validateObjectId,
    async (
      req: RequestWithParams<URIParamsCommentIdModel>,
      res: Response,
    ): Promise<void> => {
      const comment: MappedCommentModel | null =
        await commentsQueryRepository.getCommentById(req.params.id)

      comment ? res.status(200).send(comment) : res.sendStatus(404)
    },
  )

  router.put(
    `/:id`,
    authBearerMiddleware,
    ValidateComment(),
    CommentErrorsValidation,
    async (
      req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreateCommentModel>,
      res: Response,
    ) => {
      if (!req.user) return res.sendStatus(401)

      const comment: MappedCommentModel | null =
        await commentsQueryRepository.getCommentById(req.params.id)

      if (!comment) return res.sendStatus(404)

      if (
        comment?.commentatorInfo.userId.toString() === req.user._id.toString()
      ) {
        const isUpdated: boolean = await commentsService.updateComment(
          req.params.id,
          req.body.content,
        )

        return isUpdated ? res.sendStatus(204) : res.sendStatus(404)
      } else {
        return res.sendStatus(403)
      }
    },
  )

  router.delete(
    `/:id`,
    authBearerMiddleware,
    async (req: RequestWithParams<URIParamsCommentIdModel>, res: Response) => {
      if (!req.user) return res.sendStatus(401)

      const comment: MappedCommentModel | null =
        await commentsQueryRepository.getCommentById(req.params.id)

      if (!comment) return res.sendStatus(404)

      if (
        comment.commentatorInfo.userId.toString() === req.user._id.toString()
      ) {
        const isDeleted: boolean = await commentsService.deleteComment(
          req.params.id,
        )

        return isDeleted ? res.sendStatus(204) : res.sendStatus(404)
      } else {
        return res.sendStatus(403)
      }
    },
  )

  return router
}
