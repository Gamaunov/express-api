import { NextFunction, Request, Response } from 'express'

import { commentsRepository } from '../../reposotories/comments-repository'

export const FindCommentMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const commentId = req.params.id

  const comment = await commentsRepository.getCommentById(commentId)

  if (!comment) return res.sendStatus(404)

  return next()
}
