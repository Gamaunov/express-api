import { NextFunction, Request, Response } from 'express'
import { ValidationError, body, validationResult } from 'express-validator'

import { blogsRepository } from '../../repositories/blogs-repository'

const validateBlogId = async (blogId: string) => {
  const blog = await blogsRepository.getBlogByBlogId(blogId)
  if (!blog) {
    throw new Error('blogId')
  }
}

export const PostValidation = () => {
  return [
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
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Invalid blogId')
      .custom(validateBlogId),
  ]
}

export const PostErrorsValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorsMessages = errors
      .array({ onlyFirstError: true })
      .map((e) => ErrorsFormatter(e))

    const responseData = {
      errorsMessages: errorsMessages,
      errorMessages: errorsMessages,
    }

    res.status(400).json(responseData)
    return
  }
  next()
}

const ErrorsFormatter = (e: ValidationError) => {
  switch (e.type) {
    case 'field':
      return {
        message: e.msg,
        field: e.path,
      }
    default:
      return {
        message: e.msg,
        field: 'None',
      }
  }
}
