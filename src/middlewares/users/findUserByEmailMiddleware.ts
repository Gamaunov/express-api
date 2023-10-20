import { NextFunction, Request, Response } from 'express'

import { usersRepository } from '../../reposotories/users-repository'

export const FindUserByEmailMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const exist = await usersRepository.findUserByEmail(req.body.email)

  if (!exist) {
    const message = {
      errorsMessages: [
        {
          message: 'Email doesnt exist',
          field: 'email',
        },
      ],
    }

    return res.status(400).send(message)
  }

  return next()
}
