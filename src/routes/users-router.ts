import express, { Request, Response } from 'express'

import { usersService } from '../domain/users-service'
import {
  checkBasicMiddleware,
  userErrorsValidation,
  userValidation,
  validateObjectId,
} from '../middlewares'
import {
  CreateUserModel,
  PaginatorUserModel,
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
    checkBasicMiddleware,
    async (req: RequestWithQuery<UserQueryModel>, res: Response) => {
      const data: UserQueryModel = req.query

      const users: PaginatorUserModel | null =
        await usersQueryRepository.getAllUsers(data)

      return res.status(200).send(users)
    },
  )

  router.post(
    `/`,
    checkBasicMiddleware,
    userValidation(),
    userErrorsValidation,
    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
      const data: CreateUserModel = req.body

      const newUser: UserViewModel = await usersService.createUser(data)

      return res.status(201).send(newUser)
    },
  )

  router.delete(
    `/:id`,
    checkBasicMiddleware,
    validateObjectId,
    async (req: RequestWithParams<URIParamsUserModel>, res) => {
      const isDeleted: boolean = await usersService.deleteUser(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  router.delete(
    `/`,
    checkBasicMiddleware,
    validateObjectId,
    async (req: Request, res): Promise<void> => {
      const isDeleted: boolean = await usersService.deleteUser(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  return router
}
