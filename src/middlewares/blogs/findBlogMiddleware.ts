import { NextFunction, Request, Response } from 'express'

import { blogsRepository } from '../../reposotories/blogs-repository'

export const FindBlogMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const blogId = req.params.blogId
  const blog = await blogsRepository.getBlogById(blogId)

  if (!blog) return res.sendStatus(404)

  return next()
}
