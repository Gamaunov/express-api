import { Router } from 'express'

import { container } from '../composition-root'
import { AuthController } from '../controllers/AuthController'
import {
  authBearerMiddleware,
  authErrorsValidation,
  authValidation,
  checkEmail,
  checkEmailCode,
  checkRefreshToken,
  emailErrorsValidation,
  emailValidation,
  userErrorsValidation,
  userValidation,
} from '../middlewares'
import { rateLimitMiddleware } from '../middlewares/auth/rateLimitMiddleware'
import {
  recoveryInputErrorsValidation,
  recoveryInputValidation,
} from '../middlewares/auth/recoveryInputValidation'

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
  authValidation(),
  authErrorsValidation,
  authController.login.bind(authController),
)

authRouter.post('/logout', authController.logout.bind(authController))

authRouter.post(
  '/registration',
  rateLimitMiddleware,
  userValidation(),
  userErrorsValidation,
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
  emailValidation(),
  emailErrorsValidation,
  checkEmail,
  authController.emailResending.bind(authController),
)

authRouter.post(
  '/password-recovery',
  rateLimitMiddleware,
  emailValidation(),
  emailErrorsValidation,
  authController.passwordRecovery.bind(authController),
)

authRouter.post(
  '/new-password',
  rateLimitMiddleware,
  recoveryInputValidation(),
  recoveryInputErrorsValidation,
  authController.changePassword.bind(authController),
)

authRouter.post(
  '/refresh-token',
  checkRefreshToken,
  authController.refreshTokens.bind(authController),
)
