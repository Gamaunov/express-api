import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { devicesCollection } from '../../db/db'
import { settings } from '../../settings'
import { IRTokenInfo } from '../../shared'

export const CheckRTMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.cookies.refreshToken) return res.sendStatus(401)

  try {
    const verifiedToken = jwt.verify(
      req.cookies.refreshToken,
      settings.JWT_SECRET,
    ) as IRTokenInfo

    const device = await devicesCollection.findOne({
      userId: verifiedToken.userId,
      deviceId: verifiedToken.deviceId,
    })

    if (
      device &&
      verifiedToken.iat === device.issuedAt &&
      verifiedToken.exp === device.expirationAt
    ) {
      return next()
    }
    return res.sendStatus(401)
  } catch (e) {
    return res.sendStatus(401)
  }
}
