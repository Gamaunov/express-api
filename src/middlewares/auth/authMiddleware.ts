import { NextFunction, Request, Response } from 'express'

import { jwtService } from '../../application/jwtService'
import { usersService } from '../../domain/users-service'

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return res.sendStatus(401)
  }

  const token = req.headers.authorization.split(' ')[1]
  const userId = await jwtService.getUserIdByToken(token)

  if (userId) {
    const user = await usersService.getUserById(userId)
    if (!user) {
      req.user = user
      return next()
    }
  }

  return res.sendStatus(401)
}
