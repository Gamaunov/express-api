import { NextFunction, Request, Response } from 'express'

import { UserDBModel } from '../../models'
import { usersRepository } from '../../reposotories/users-repository'

export const CheckLoginAndEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const login: UserDBModel | null =
    await usersRepository.findUserByLoginOrEmail(req.body.login)
  const email: UserDBModel | null =
    await usersRepository.findUserByLoginOrEmail(req.body.email)

  if (login) {
    const message = {
      errorsMessages: [
        {
          message: 'login already exist',
          field: 'login',
        },
      ],
    }

    return res.status(400).send(message)
  }

  if (email) {
    const message = {
      errorsMessages: [
        {
          message: 'email already exist',
          field: 'email',
        },
      ],
    }

    return res.status(400).send(message)
  }

  return next()
}
