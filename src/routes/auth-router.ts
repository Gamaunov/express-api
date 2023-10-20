import express, { Response } from 'express'

import { jwtService } from '../application/jwtService'
import { authService } from '../domain/auth-service'
import { emailManager } from '../managers/email-manager'
import {
  AuthErrorsValidation,
  AuthValidation,
  CheckEmail,
  CheckEmailCode,
  CheckLoginAndEmail,
  EmailErrorsValidation,
  EmailValidation,
  UserErrorsValidation,
  UserValidation,
  authMiddleware,
} from '../middlewares'
import { CreateUserModel, UserAccountDBModel } from '../models'
import {
  ConfirmCodeType,
  EmailType,
  LoginOrEmailType,
  RequestWithBody,
  UserInfoType,
} from '../shared'

export const authRouter = () => {
  const router = express.Router()

  router.post(
    '/registration',
    UserValidation(),
    UserErrorsValidation,
    CheckLoginAndEmail,
    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
      const user = await authService.createUser(
        req.body.login,
        req.body.email,
        req.body.password,
      )

      if (!user) {
        return res.sendStatus(400)
      } else {
        return res.sendStatus(204)
      }
    },
  )

  router.post(
    '/registration-confirmation',
    CheckEmailCode,
    async (req: RequestWithBody<ConfirmCodeType>, res: Response) => {
      const result = await authService.confirmEmail(req.body.code)

      if (!result) {
        return res.sendStatus(400)
      } else {
        return res.sendStatus(204)
      }
    },
  )

  router.post(
    '/registration-email-resending',
    EmailValidation(),
    EmailErrorsValidation,
    CheckEmail,
    async (req: RequestWithBody<EmailType>, res: Response) => {
      const user = await authService.resendConfirmationCode(req.body.email)

      if (user) {
        try {
          await emailManager.sendEmailConfirmationMessage(
            req.body.email,
            user.emailConfirmation.confirmationCode,
          )
        } catch (e) {
          return null
        }

        return res.sendStatus(204)
      }
      return res.sendStatus(400)
    },
  )

  router.post(
    '/login',
    AuthValidation(),
    AuthErrorsValidation,
    async (req: RequestWithBody<LoginOrEmailType>, res: Response) => {
      const user: UserAccountDBModel | null =
        await authService.checkCredentials(
          req.body.loginOrEmail,
          req.body.password,
        )

      if (user) {
        const token = await jwtService.createJWT(user)

        return res.status(200).send({ accessToken: token })
      } else {
        return res.sendStatus(401)
      }
    },
  )

  router.get(
    '/me',
    authMiddleware,
    async (req: RequestWithBody<UserInfoType>, res: Response) => {
      if (req.user) {
        const userInfo = {
          email: req.user.accountData.email,
          login: req.user.accountData.login,
          userId: req.user._id,
        }

        return res.status(200).send(userInfo)
      }

      return res.sendStatus(401)
    },
  )

  return router
}
