import express, { Request, Response } from 'express'
import { ObjectId } from 'mongodb'

import { jwtService } from '../application/jwtService'
import { authService } from '../domain/auth-service'
import { securityDevicesService } from '../domain/security-devices-service'
import { usersService } from '../domain/users-service'
import {
  AuthErrorsValidation,
  AuthValidation,
  CheckEmail,
  CheckEmailCode,
  CheckRefreshToken,
  EmailErrorsValidation,
  EmailValidation,
  UserErrorsValidation,
  UserValidation,
  authBearerMiddleware,
} from '../middlewares'
import { rateLimitMiddleware } from '../middlewares/auth/rateLimitMiddleware'
import {
  RecoveryInputErrorsValidation,
  RecoveryInputValidation,
} from '../middlewares/auth/recoveryInputValidation'
import { CreateUserModel, MappedUserModel, UserDBModel } from '../models'
import {
  ConfirmCodeType,
  EmailType,
  ITokenPayload,
  LoginOrEmailType,
  NewPasswordRecoveryInputType,
  RequestWithBody,
  UserInfoType,
} from '../shared'

export const authRouter = () => {
  const router = express.Router()

  router.get(
    '/me',
    authBearerMiddleware,
    async (req: RequestWithBody<UserInfoType>, res: Response) => {
      if (!req.user) return res.sendStatus(401)

      const userInfo = {
        email: req.user.accountData.email,
        login: req.user.accountData.login,
        userId: req.user._id,
      }

      return res.status(200).send(userInfo)
    },
  )

  router.post(
    '/login',
    rateLimitMiddleware,
    AuthValidation(),
    AuthErrorsValidation,
    async (req: RequestWithBody<LoginOrEmailType>, res: Response) => {
      const user: UserDBModel | null = await authService.checkCredentials(
        req.body.loginOrEmail,
        req.body.password,
      )

      if (!user) {
        res.sendStatus(401)
        return
      }

      const userAgent: string = req.headers['user-agent'] || 'unknown'

      const newAccessToken: string = await jwtService.createAccessToken(user)
      const newRefreshToken: string = await jwtService.createRefreshToken(user)

      await securityDevicesService.createDevice(
        newRefreshToken,
        req.ip,
        userAgent,
      )

      res
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .send({ accessToken: newAccessToken })
    },
  )

  router.post('/logout', async (req: Request, res: Response): Promise<void> => {
    const user: ITokenPayload | null = await jwtService.verifyToken(
      req.cookies.refreshToken,
    )

    if (!user) {
      res.sendStatus(401)
      return
    }

    await securityDevicesService.terminateSession(user.deviceId)

    res.clearCookie('refreshToken', { httpOnly: true, secure: true })
    res.sendStatus(204)
  })

  router.post(
    '/registration',
    rateLimitMiddleware,
    UserValidation(),
    UserErrorsValidation,
    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
      const user: MappedUserModel | null = await authService.createUser(
        req.body.login,
        req.body.email,
        req.body.password,
      )

      return user ? res.sendStatus(204) : res.sendStatus(400)
    },
  )

  router.post(
    '/registration-confirmation',
    rateLimitMiddleware,
    CheckEmailCode,
    async (req: RequestWithBody<ConfirmCodeType>, res: Response) => {
      const result: boolean = await authService.confirmEmail(req.body.code)

      return result ? res.sendStatus(204) : res.sendStatus(400)
    },
  )

  router.post(
    '/registration-email-resending',
    rateLimitMiddleware,
    EmailValidation(),
    EmailErrorsValidation,
    CheckEmail,
    async (req: RequestWithBody<EmailType>, res: Response) => {
      const result: boolean | null = await authService.resendConfirmationCode(
        req.body.email,
      )

      return result ? res.sendStatus(204) : res.sendStatus(400)
    },
  )

  router.post(
    '/password-recovery',
    rateLimitMiddleware,
    EmailValidation(),
    EmailErrorsValidation,
    async (req: RequestWithBody<EmailType>, res: Response): Promise<void> => {
      await authService.sendPasswordRecoveryCode(req.body.email)
      res.sendStatus(204)
    },
  )

  router.post(
    '/new-password',
    rateLimitMiddleware,
    RecoveryInputValidation(),
    RecoveryInputErrorsValidation,
    async (
      req: RequestWithBody<NewPasswordRecoveryInputType>,
      res: Response,
    ): Promise<any> => {
      const user: UserDBModel | null =
        await usersService.findUserByPasswordRecoveryCode(req.body.recoveryCode)

      if (!user || user.passwordRecovery.expirationDate! < new Date()) {
        return res.sendStatus(400)
      }

      await authService.changePassword(
        req.body.recoveryCode,
        req.body.newPassword,
      )
      res.sendStatus(204)
    },
  )

  router.post(
    '/refresh-token',
    CheckRefreshToken,
    async (req: Request, res: Response) => {
      const verifiedToken: ITokenPayload | null = await jwtService.verifyToken(
        req.cookies.refreshToken,
      )

      const user: UserDBModel | null = await usersService.getUserById(
        new ObjectId(verifiedToken?.userId),
      )

      if (!user) return res.sendStatus(401)

      const newAccessToken: string = await jwtService.createAccessToken(
        user,
        verifiedToken?.deviceId,
      )
      const newRefreshToken: string = await jwtService.createRefreshToken(
        user,
        verifiedToken?.deviceId,
      )

      const newVerifiedRT: ITokenPayload | null =
        await jwtService.verifyToken(newRefreshToken)

      if (!newVerifiedRT) return res.sendStatus(401)

      await securityDevicesService.updateDevice(
        req.ip,
        verifiedToken!.userId.toString(),
        newVerifiedRT!.iat,
      )

      return res
        .cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .send({ accessToken: newAccessToken })
    },
  )

  return router
}
