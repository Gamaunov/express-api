import { NextFunction, Request, Response } from 'express'

import { BlogOutputModel } from '../../models'
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query.repository'

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
