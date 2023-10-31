import express, { Request, Response } from 'express'

import { usersService } from '../domain/users-service'
import {
  UserErrorsValidation,
  UserValidation,
  authBasicMiddleware,
  validateObjectId,
} from '../middlewares'
import {
  CreateUserModel,
  URIParamsUserModel,
  UserQueryModel,
  UserViewModel,
} from '../models'
import { usersQueryRepository } from '../reposotories/query-repositories/users-query-repository'
import { RequestWithBody, RequestWithParams, RequestWithQuery } from '../shared'

export const usersRouter = () => {
  const router = express.Router()

  router.get(
    `/`,
    authBasicMiddleware,
    async (req: RequestWithQuery<UserQueryModel>, res: Response) => {
      const data = req.query

      const users = await usersQueryRepository.getAllUsers(data)

      return res.status(200).send(users)
    },
  )

  router.post(
    `/`,
    authBasicMiddleware,
    UserValidation(),
    UserErrorsValidation,
    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
      const data: CreateUserModel = req.body

      const newUser: UserViewModel = await usersService.createUser(data)

      return res.status(201).send(newUser)
    },
  )

  router.delete(
    `/:id`,
    authBasicMiddleware,
    validateObjectId,
    async (req: RequestWithParams<URIParamsUserModel>, res) => {
      const isDeleted: boolean = await usersService.deleteUser(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  router.delete(
    `/`,
    authBasicMiddleware,
    validateObjectId,
    async (req: Request, res): Promise<void> => {
      const isDeleted: boolean = await usersService.deleteUser(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  return router
}
