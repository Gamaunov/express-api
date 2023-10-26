import express, { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

import { jwtService } from '../application/jwtService'
import { usersCollection } from '../db/db'
import { authService } from '../domain/auth-service'
import { usersService } from '../domain/users-service'
import { emailManager } from '../managers/email-manager'
import {
  AuthErrorsValidation,
  AuthValidation,
  CheckEmail,
  CheckEmailCode,
  CheckLoginAndEmail,
  CheckRTMiddleware,
  CheckRefreshToken,
  CountOfLoginAttempts,
  EmailErrorsValidation,
  EmailValidation,
  UserErrorsValidation,
  UserValidation,
  authMiddleware,
} from '../middlewares'
import { CreateUserModel, DeviceInfoModel, UserAccountDBModel } from '../models'
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
    CountOfLoginAttempts,
    UserValidation(),
    UserErrorsValidation,
    CheckLoginAndEmail,
    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
      const user = await authService.createUser(
        req.body.login,
        req.body.email,
        req.body.password,
      )

      return !user ? res.sendStatus(400) : res.sendStatus(204)
    },
  )

  router.post(
    '/registration-confirmation',
    CountOfLoginAttempts,
    CheckEmailCode,
    async (req: RequestWithBody<ConfirmCodeType>, res: Response) => {
      const result = await authService.confirmEmail(req.body.code)

      return !result ? res.sendStatus(400) : res.sendStatus(204)
    },
  )

  router.post(
    '/registration-email-resending',
    CountOfLoginAttempts,
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
    '/refresh-token',
    CheckRTMiddleware,
    async (req: Request, res: Response) => {
      const client = await jwtService.getUserInfoByRT(req.cookies.refreshToken)

      if (!client) return res.sendStatus(401)

      const userId = client.userId
      const deviceId = client.deviceId

      const user = await usersService.getUserById(new ObjectId(userId))

      if (!user) return res.sendStatus(401)

      if (user) {
        const newAccessToken = await jwtService.createJWT(user)
        const newRefreshToken = await jwtService.createRefreshToken(
          user,
          deviceId,
        )

        const deviceInfo: DeviceInfoModel = {
          userId: userId,
          deviceId: deviceId,
          refreshToken: newRefreshToken,
          deviceName: req.headers['user-agent']
            ? req.headers['user-agent'].toString()
            : 'unknown',
          ip: req.ip,
        }

        try {
          await authService.addDeviceInfo(deviceInfo)
        } catch (e) {
          console.log('unsuccessful attempt at adding a device: ', e)
          return null
        }

        return res
          .cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
          })
          .header('accessToken', newAccessToken)
          .status(200)
          .send({ accessToken: newAccessToken })
      }

      return res.sendStatus(401)
    },
  )

  router.post(
    '/login',
    CountOfLoginAttempts,
    AuthValidation(),
    AuthErrorsValidation,
    async (req: RequestWithBody<LoginOrEmailType>, res: Response) => {
      const user: UserAccountDBModel | null =
        await authService.checkCredentials(
          req.body.loginOrEmail,
          req.body.password,
        )

      if (!user) return res.sendStatus(401)

      const token = await jwtService.createJWT(user)

      const deviceId = uuidv4()

      const refreshToken = await jwtService.createRefreshToken(user, deviceId)

      const deviceInfo: DeviceInfoModel = {
        userId: user._id.toString(),
        deviceId: deviceId,
        refreshToken: refreshToken,
        deviceName: req.headers['user-agent']
          ? req.headers['user-agent']
          : 'unknown',
        ip: req.ip,
      }

      try {
        await authService.addDeviceInfo(deviceInfo)
      } catch (e) {
        console.log('unsuccessful attempt at adding a device: ', e)
        return null
      }

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      })

      res.header('accessToken', token)

      return res.status(200).send({ accessToken: token })
    },

    router.post(
      '/logout',
      CheckRefreshToken,
      async (req: Request, res: Response) => {
        await usersCollection.updateOne(
          { _id: new ObjectId(req.userId) },
          { $push: { refreshTokenBlackList: req.cookies.refreshToken } },
        )

        res.clearCookie('refreshToken', { httpOnly: true, secure: true })
        res.sendStatus(204)
      },
    ),
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
