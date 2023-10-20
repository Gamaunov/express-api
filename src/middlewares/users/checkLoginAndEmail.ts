import { NextFunction, Request, Response } from 'express'

import { usersRepository } from '../../reposotories/users-repository'

export const CheckLoginAndEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const login = await usersRepository.findUserByLogin(req.body.login)
  const email = await usersRepository.findUserByEmail(req.body.email)

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
