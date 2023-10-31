import { NextFunction, Request, Response } from 'express'

import { BlogOutputModel } from '../../models'
import { blogsQueryRepository } from '../../reposotories/query-repositories/blogs-query-repository'

export const FindBlogMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const blog: BlogOutputModel | null = await blogsQueryRepository.getBlogById(
    req.params.blogId,
  )

  if (!blog) return res.sendStatus(404)

  return next()
}
