import { NextFunction, Request, Response } from 'express'

import { usersRepository } from '../../reposotories/users-repository'

export const CheckEmailConfirmation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const foundUser = await usersRepository.findUserByConfirmationCode(
    req.body.code,
  )

  if (foundUser?.emailConfirmation.isConfirmed) {
    const message = {
      errorsMessages: [
        {
          message: 'Email already activated',
          field: 'email',
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
          field: 'Confirmation code',
        },
      ],
    }

    return res.status(400).send(message)
  }

  if (
    foundUser !== null &&
    foundUser.emailConfirmation.expirationDate < new Date()
  ) {
    const message = {
      errorsMessages: [
        {
          message: 'Confirmation code is expired',
          field: 'Confirmation code',
        },
      ],
    }

    return res.status(400).send(message)
  }

  return next()
}
