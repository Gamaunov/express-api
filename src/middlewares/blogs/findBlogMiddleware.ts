import { NextFunction, Request, Response } from 'express'

import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query.repository'
import { BlogOutputModel } from '../../models'

const blogsQueryRepository = new BlogsQueryRepository()

export const findBlogMiddleware = async (
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
