import { NextFunction, Request, Response } from 'express'

import { postsRepository } from '../../reposotories/posts-repository'

export const FindPostMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const postId = req.params.postId
  const post = await postsRepository.getPostById(postId)

  if (!post) return res.sendStatus(404)

  return next()
}
