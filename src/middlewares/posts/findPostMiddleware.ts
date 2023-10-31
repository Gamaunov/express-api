import { NextFunction, Request, Response } from 'express'

import { PostOutputModel } from '../../models'
import { postsQueryRepository } from '../../reposotories/query-repositories/posts-query-repository'

export const FindPostMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const post: PostOutputModel | null = await postsQueryRepository.getPostById(
    req.params.postId,
  )

  if (!post) return res.sendStatus(404)

  return next()
}
