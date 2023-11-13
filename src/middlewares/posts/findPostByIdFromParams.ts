import { NextFunction, Request, Response } from 'express'

import { container } from '../../composition-root'
import { PostOutputModel } from '../../models'
import { PostsQueryRepository } from '../../infrastructure/query-repositories/postsQuery.repository'

const postsQueryRepository = container.resolve(PostsQueryRepository)
export const findPostByIdFromParams = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const post: PostOutputModel | null = await postsQueryRepository.findPostById(
    req.params.postId,
  )

  if (!post) {
    return res.sendStatus(404)
  }

  return next()
}
