import express, { Response } from 'express'

import { commentsService } from '../domain/comments-service'
import {
  CommentErrorsValidation,
  FindCommentMiddleware,
  ValidateComment,
  authMiddleware,
  validateObjectId,
} from '../middlewares'
import {
  CreateCommentModel,
  URIParamsBlogIdModel,
  URIParamsCommentIdModel,
} from '../models'
import { commentsRepository } from '../reposotories/comments-repository'
import { RequestWithParams, RequestWithParamsAndBody } from '../shared'

export const commentsRouter = () => {
  const router = express.Router()

  router.put(
    `/:id`,
    FindCommentMiddleware,
    authMiddleware,
    ValidateComment(),
    CommentErrorsValidation,
    async (
      req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreateCommentModel>,
      res: Response,
    ) => {
      // if (req.user) {
      //   const paramsId = req.params.id

      //   const comment = await commentsRepository.getCommentById(paramsId)

      // if (comment?.commentatorInfo.userId === req.user._id.toString()) {
      //   const { content } = req.body

      //   await commentsService.updateComment(paramsId, content)

      //   return res.sendStatus(204)
      // } else {
      //   return res.sendStatus(403)
      // }
      // } else {
      //   return res.sendStatus(401)
      // }
      if (!req.user) return res.sendStatus(401)

      const comment = await commentsRepository.getCommentById(req.params.id)

      if (comment?.commentatorInfo.userId.toString() === req.user._id.toString()) {
        const { content } = req.body
        // console.log(comment?.commentatorInfo.userId.toString() === req.user._id.toString(),'===');
        // console.log(comment?.commentatorInfo.userId.toString(),'=commentatorInfo.userId==');
        // console.log(req.user._id.toString(),'==req.user=');
        await commentsService.updateComment(req.params.id, content)

        return res.sendStatus(204)
      } else {
        return res.sendStatus(403)
      }
    },
  )

  router.get(
    `/:id`,
    validateObjectId,
    async (req: RequestWithParams<URIParamsCommentIdModel>, res: Response) => {
      const comment = await commentsService.getCommentById(req.params.id)

      comment ? res.status(200).send(comment) : res.sendStatus(404)
    },
  )

  router.delete(
    `/:id`,
    FindCommentMiddleware,
    authMiddleware,
    async (req: RequestWithParams<URIParamsCommentIdModel>, res: Response) => {
      // if (req.user) {
      // const paramsId = req.params.id

      // const comment = await commentsRepository.getCommentById(paramsId)

      // if (comment?.commentatorInfo.userId === req.user._id.toString()) {
      //   await commentsService.deleteComment(req.params.id)

      //   return res.sendStatus(204)
      // } else {
      //   return res.sendStatus(403)
      // }
      // } else {
      //   return res.sendStatus(401)
      // }
      if (!req.user) return res.sendStatus(401)

      const comment = await commentsRepository.getCommentById(req.params.id)

      if (comment?.commentatorInfo.userId.toString() === req.user._id.toString()) {
        await commentsService.deleteComment(req.params.id)

        return res.sendStatus(204)
      } else {
        return res.sendStatus(403)
      }
    },
  )

  return router
}
