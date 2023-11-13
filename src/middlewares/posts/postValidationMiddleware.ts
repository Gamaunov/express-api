import { body } from 'express-validator'

import { BlogOutputModel } from '../../models'
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query.repository'

const blogsQueryRepository = new BlogsQueryRepository()
const validateBlogId = async (blogId: string): Promise<boolean> => {
  const blog: BlogOutputModel | null =
    await blogsQueryRepository.getBlogById(blogId)
  if (!blog) {
    throw new Error()
  }
  return true
}

export const postValidation = [
  body('title')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Invalid title'),

  body('shortDescription')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Invalid shortDescription'),

  body('content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Invalid content'),

  body('blogId')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Invalid blogId')
    .custom(validateBlogId),
]
