import { NextFunction, Request, Response } from 'express'

import { usersService } from '../../domain/users-service'
import { UserDBModel } from '../../models'

export const CheckEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user: UserDBModel | null = await usersService.findUserByLoginOrEmail(
    req.body.email,
  )

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
