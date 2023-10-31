import { NextFunction, Request, Response } from 'express'
import { ValidationError, body, validationResult } from 'express-validator'

export const RecoveryInputValidation = () => {
  return [
    body('newPassword')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Invalid newPassword'),

    body('recoveryCode')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Invalid recoveryCode'),
  ]
}

export const RecoveryInputErrorsValidation = (
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

    return res.status(400).json(responseData)
  }

  return next()
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
