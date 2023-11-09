import { NextFunction, Request, Response } from 'express'
import { ValidationError, body, validationResult } from 'express-validator'

export const validateComment = () => {
  return [
    body('content')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 20, max: 300 })
      .withMessage('Invalid content'),
  ]
}

export const commentErrorsValidation = (
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
