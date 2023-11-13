import { Router } from 'express'

import { container } from '../composition-root'
import { AuthController } from '../controllers/auth.controller'
import {
  authBearerMiddleware,
  authValidation,
  checkEmail,
  checkEmailCode,
  checkRefreshToken,
  emailValidation,
  errorsValidation,
  userValidation,
} from '../middlewares'
import { rateLimitMiddleware } from '../middlewares/auth/rateLimitMiddleware'
import { recoveryInputValidation } from '../middlewares/auth/recoveryInputValidation'

export const authRouter = Router({})
const authController = container.resolve(AuthController)

authRouter.get(
  '/me',
  authBearerMiddleware,
  authController.getAccountInfo.bind(authController),
)

authRouter.post(
  '/login',
  rateLimitMiddleware,
  authValidation,
  errorsValidation,
  authController.login.bind(authController),
)

authRouter.post('/logout', authController.logout.bind(authController))

authRouter.post(
  '/registration',
  rateLimitMiddleware,
  userValidation,
  errorsValidation,
  authController.registerUser.bind(authController),
)

authRouter.post(
  '/registration-confirmation',
  rateLimitMiddleware,
  checkEmailCode,
  authController.confirmRegistration.bind(authController),
)

authRouter.post(
  '/registration-email-resending',
  rateLimitMiddleware,
  emailValidation,
  errorsValidation,
  checkEmail,
  authController.emailResending.bind(authController),
)

authRouter.post(
  '/password-recovery',
  rateLimitMiddleware,
  emailValidation,
  errorsValidation,
  authController.passwordRecovery.bind(authController),
)

authRouter.post(
  '/new-password',
  rateLimitMiddleware,
  recoveryInputValidation,
  errorsValidation,
  authController.changePassword.bind(authController),
)

authRouter.post(
  '/refresh-token',
  checkRefreshToken,
  authController.refreshTokens.bind(authController),
)
