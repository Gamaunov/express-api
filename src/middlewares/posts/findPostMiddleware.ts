import { NextFunction, Request, Response } from 'express'

import { container } from '../../composition-root'
import { PostOutputModel } from '../../models'
import { PostsQueryRepository } from '../../reposotories/query-repositories/posts-query-repository'

const postsQueryRepository = container.resolve(PostsQueryRepository)
export const findPostMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const post: PostOutputModel | null = await postsQueryRepository.getPostById(
    req.params.postId,
  )

  if (!post) {
    return res.sendStatus(404)
  }

  return next()
}
