import { NextFunction, Request, Response } from 'express'

import { usersService } from '../../domain/users-service'
import { UserDBModel } from '../../models'

export const checkEmailCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const foundUser: UserDBModel | null =
    await usersService.findUserByEmailConfirmationCode(req.body.code)

  if (!foundUser) {
    res.sendStatus(404)
    return
  }

  if (foundUser?.emailConfirmation.isConfirmed) {
    const message = {
      errorsMessages: [
        {
          message: 'code already confirmed',
          field: 'code',
        },
      ],
    }

    return res.status(400).send(message)
  }

  if (foundUser?.emailConfirmation.confirmationCode !== req.body.code) {
    const message = {
      errorsMessages: [
        {
          message: 'Confirmation code is incorrect',
          field: 'code',
        },
      ],
    }

    return res.status(400).send(message)
  }

  if (foundUser.emailConfirmation.expirationDate) {
    if (foundUser.emailConfirmation.expirationDate < new Date()) {
      const message = {
        errorsMessages: [
          {
            message: 'Confirmation code is expired',
            field: 'code',
          },
        ],
      }

      return res.status(400).send(message)
    }
  }

  return next()
}
