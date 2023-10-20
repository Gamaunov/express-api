import { NextFunction, Request, Response } from 'express'

import { usersRepository } from '../../reposotories/users-repository'

export const CheckEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await usersRepository.findUserByEmail(req.body.email)

  if (!user) {
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

  if (user.emailConfirmation.isConfirmed) {
    const message = {
      errorsMessages: [
        {
          message: 'Email already confirmed',
          field: 'email',
        },
      ],
    }

    return res.status(400).send(message)
  }

  return next()
}
