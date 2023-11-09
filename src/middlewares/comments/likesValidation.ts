import { NextFunction, Request, Response } from 'express'
import { ValidationError, body, validationResult } from 'express-validator'

import { LikeStatus } from '../../shared'

export const likesValidation = () => {
  return [
    body('likeStatus')
      .exists()
      .isString()
      .trim()
      .isIn([LikeStatus.none, LikeStatus.like, LikeStatus.dislike])
      .withMessage('Invalid like status'),
  ]
}

export const likesErrorsValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorsMessages = errors
      .array({ onlyFirstError: true })
      .map((e) => errorsFormatter(e))

    const responseData = {
      errorsMessages: errorsMessages,
    }

    res.status(400).json(responseData)
    return
  }
  next()
}

const errorsFormatter = (e: ValidationError) => {
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
