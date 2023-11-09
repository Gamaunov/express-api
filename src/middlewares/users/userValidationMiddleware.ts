import { NextFunction, Request, Response } from 'express'
import { ValidationError, body, validationResult } from 'express-validator'

import { UsersService } from '../../application/users-service'
import { container } from '../../composition-root'
import { UserModel } from '../../models'

const usersService = container.resolve(UsersService)
const uniqueLoginOrEmail = async (loginOrEmail: string) => {
  const foundLoginOrEmail: UserModel | null =
    await usersService.findUserByLoginOrEmail(loginOrEmail)

  if (foundLoginOrEmail) {
    return Promise.reject(`Invalid ${loginOrEmail}`)
  }
  return
}

export const userValidation = () => {
  return [
    body('login')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 3, max: 10 })
      .matches(/^[a-zA-Z0-9_-]*$/)
      .custom(async (login: string): Promise<void> => {
        await uniqueLoginOrEmail(login)
      })
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
      .custom(async (email: string): Promise<void> => {
        await uniqueLoginOrEmail(email)
      })
      .withMessage('Invalid email'),
  ]
}

export const userErrorsValidation = (
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
