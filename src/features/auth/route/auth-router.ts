import express, { Request, Response } from 'express'

import { usersService } from '../../users'
import {
  AuthErrorsValidation,
  AuthValidation,
} from '../middlewares/auth-validation-middleware'

export const authRouter = () => {
  const router = express.Router()

  router.post(
    '/login',
    AuthValidation(),
    AuthErrorsValidation,
    async (req: Request, res: Response) => {
      const result = await usersService.checkCredentials(
        req.body.loginOrEmail,
        req.body.password,
      )

      !result ? res.sendStatus(401) : res.sendStatus(204)
    },
  )

  return router
}
