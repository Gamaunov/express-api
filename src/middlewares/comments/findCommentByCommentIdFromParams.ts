import { NextFunction, Request, Response } from 'express'

import { container } from '../../composition-root'
import { MappedCommentModel } from '../../models'
import { CommentsQueryRepository } from '../../reposotories/query-repositories/comments-query-repository'

const commentsQueryRepository = container.resolve(CommentsQueryRepository)
export const findCommentByCommentIdFromParams = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const comment: MappedCommentModel | null =
    await commentsQueryRepository.getCommentById(req.params.commentId)

  if (!comment) return res.sendStatus(404)

  return next()
}
