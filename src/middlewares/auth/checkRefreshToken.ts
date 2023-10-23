import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'

import { authService } from '../../domain/auth-service'
import { usersRepository } from '../../reposotories/users-repository'

export const CheckRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.cookies.refreshToken) {
    return res.status(401).send({ message: 'Refresh token not found' })
  }

  const verifiedToken = await authService.checkRefreshToken(
    req.cookies.refreshToken,
  )

  if (!verifiedToken) {
    return res.status(401).send({ message: 'Invalid refresh token' })
  }

  const user = await usersRepository.getUserById(verifiedToken.userId)

  if (!user) return res.sendStatus(401)

  const isTokenInvalid = await authService.findTokenInBlackList(
    new ObjectId(user._id),
    req.cookies.refreshToken,
  )

  if (isTokenInvalid) return res.sendStatus(401)

  req.userId = new ObjectId(user._id)

  return next()
}
