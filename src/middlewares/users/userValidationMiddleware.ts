import { NextFunction, Request, Response } from 'express'
import { ValidationError, body, validationResult } from 'express-validator'

export const UserValidation = () => {
  return [
    body('login')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 3, max: 10 })
      .matches(/^[a-zA-Z0-9_-]*$/)
      .withMessage('Invalid login'),

    body('password')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Invalid credentials'),

    body('email')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 1, max: 200 })
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .withMessage('Invalid email'),
  ]
}

export const UserErrorsValidation = (
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
