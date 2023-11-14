import { NextFunction, Request, Response } from 'express'

import { container } from '../../composition-root'
import { CommentsQueryRepository } from '../../infrastructure/query/comments.query.repository'
import { CommentViewModel } from '../../models'

const commentsQueryRepository = container.resolve(CommentsQueryRepository)
export const findCommentByCommentIdFromParams = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const comment: CommentViewModel | null =
    await commentsQueryRepository.getCommentById(req.params.commentId)

  if (!comment) return res.sendStatus(404)

  return next()
}
