import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'

import { jwtService } from '../../application/jwtService'
import { usersService } from '../../domain/users-service'
import { UserDBModel } from '../../models'
import { ITokenPayload } from '../../shared'

export const authBearerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return res.sendStatus(401)
  }

  const token: string = req.headers.authorization.split(' ')[1]
  const verifiedToken: ITokenPayload | null =
    await jwtService.verifyToken(token)

  if (verifiedToken) {
    const user: UserDBModel | null = await usersService.getUserById(
      new ObjectId(verifiedToken.userId),
    )

    if (user) {
      req.user = user

      return next()
    }
  }

  return res.sendStatus(401)
}
