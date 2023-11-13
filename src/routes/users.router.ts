import { Router } from 'express'

import { container } from '../composition-root'
import { UsersController } from '../controllers/UsersController'
import {
  checkBasicMiddleware,
  errorsValidation,
  userValidation,
  validateObjectId,
} from '../middlewares'

export const usersRouter = Router({})
const usersController = container.resolve(UsersController)

usersRouter.get(
  `/`,
  checkBasicMiddleware,
  usersController.getUsers.bind(usersController),
)

usersRouter.post(
  `/`,
  checkBasicMiddleware,
  userValidation,
  errorsValidation,
  usersController.createUser.bind(usersController),
)

usersRouter.delete(
  `/:id`,
  checkBasicMiddleware,
  validateObjectId,
  usersController.deleteUser.bind(usersController),
)

usersRouter.delete(
  `/`,
  checkBasicMiddleware,
  validateObjectId,
  usersController.deleteUsers.bind(usersController),
)
