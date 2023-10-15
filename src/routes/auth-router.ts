import express, { Request, Response } from 'express'

import { jwtService } from '../application/jwtService'
import { usersService } from '../domain/users-service'
import {
  AuthErrorsValidation,
  AuthValidation,
  authMiddleware,
} from '../middlewares'
import { UserDBTypeModel } from '../models'

export const authRouter = () => {
  const router = express.Router()

  router.post(
    '/login',
    AuthValidation(),
    AuthErrorsValidation,
    async (req: Request, res: Response) => {
      const user: boolean | UserDBTypeModel =
        await usersService.checkCredentials(
          req.body.loginOrEmail,
          req.body.password,
        )

      if (user) {
        const token = await jwtService.createJWT(user)
        res.status(200).send({ accessToken: token })
      } else {
        res.sendStatus(401)
      }
    },
  )

  router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const userInfo = {
      //@ts-ignore
      email: req.user.email,
      //@ts-ignore

      login: req.user.login,
      //@ts-ignore

      userId: req.user._id,
    }
    //@ts-ignore
    req.user ? res.status(200).send(userInfo) : res.sendStatus(401)
  })

  return router
}
