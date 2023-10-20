import { NextFunction, Request, Response } from 'express'

import { usersRepository } from '../../reposotories/users-repository'

export const ExistingUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const exist = await usersRepository.findLoginOrEmail(req.body.email)

  if (exist) {
    const message = {
      errorsMessages: [
        {
          message: 'User already exist',
          field: 'Email',
        },
      ],
    }

    return res.status(400).send(message)
  }

  return next()
}
