import { NextFunction, Request, Response } from 'express'

import { MappedCommentModel } from '../../models'
import { commentsQueryRepository } from '../../reposotories/query-repositories/comments-query-repository'

export const FindCommentMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const comment: MappedCommentModel | null =
    await commentsQueryRepository.getCommentById(req.params.id)

  if (!comment) return res.sendStatus(404)

  return next()
}
