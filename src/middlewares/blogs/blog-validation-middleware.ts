import { NextFunction, Request, Response } from 'express'
import { ValidationError, body, validationResult } from 'express-validator'

export const ValidateBlog = () => {
  return [
    body('name')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 1, max: 15 })
      .withMessage('Invalid name'),

    body('description')
      .isString()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Invalid description'),

    body('websiteUrl')
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .matches(
        /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
      )
      .withMessage('Invalid websiteUrl'),
  ]
}

export const ErrorsBlogValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array({ onlyFirstError: true })
      .map((e) => ErrorsFormatter(e))
    res.status(400).send(errorMessages)
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