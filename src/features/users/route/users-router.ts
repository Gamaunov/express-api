import express, { Request, Response } from 'express'

import { authGuardMiddleware, validateObjectId } from '../../../middlewares'
import { RequestWithBody, RequestWithParams } from '../../../shared'
import { usersService } from '../domain/users-service'
import {
  UserErrorsValidation,
  UserValidation,
} from '../middlewares/user-validation-middleware'
import { CreateUserModel } from '../models/CreatUserModel'
import { URIParamsUserModel } from '../models/URIParamsUserModel'

export const usersRouter = () => {
  const router = express.Router()

  router.get(`/`, async (req: Request, res: Response) => {
    const data = req.query

    const users = await usersService.getAllUsers(data)

    return res.status(200).send(users)
  })

  router.post(
    `/`,
    authGuardMiddleware,
    UserValidation(),
    UserErrorsValidation,
    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
      const data = req.body

      const newPost = await usersService.createUser(data)

      return res.status(201).send(newPost)
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
