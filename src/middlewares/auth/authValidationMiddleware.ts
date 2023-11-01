import { NextFunction, Request, Response } from 'express'
import { ValidationError, body, validationResult } from 'express-validator'

export const authValidation = () => {
  return [
    body('loginOrEmail')
      .notEmpty()
      .isString()
      .trim()
      .custom((value) => {
        if (
          !value.match(/^[a-zA-Z0-9_-]*$/) &&
          !value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        ) {
          throw new Error('Invalid loginOrEmail')
        }
        return true
      }),

    body('password')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Invalid credentials'),
  ]
}

export const authErrorsValidation = (
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
