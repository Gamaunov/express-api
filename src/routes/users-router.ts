import express, { Response } from 'express'

import { usersService } from '../domain/users-service'
import {
  UserErrorsValidation,
  UserValidation,
  authGuardMiddleware,
  validateObjectId,
} from '../middlewares'
import { CreateUserModel, URIParamsUserModel, UserQueryModel } from '../models'
import { RequestWithBody, RequestWithParams, RequestWithQuery } from '../shared'

export const usersRouter = () => {
  const router = express.Router()

  router.get(
    `/`,
    async (req: RequestWithQuery<UserQueryModel>, res: Response) => {
      const data = req.query

      const users = await usersService.getAllUsers(data)

      return res.status(200).send(users)
    },
  )

  router.post(
    `/`,
    authGuardMiddleware,
    UserValidation(),
    UserErrorsValidation,
    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
      const data = req.body

      const newUser = await usersService.createUser(data)

      return res.status(201).send(newUser)
    },
  )

  router.delete(
    `/:id`,
    authGuardMiddleware,
    validateObjectId,
    async (req: RequestWithParams<URIParamsUserModel>, res) => {
      const isDeleted = await usersService.deleteUser(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  return router
}
