import { NextFunction, Request, Response } from 'express'

import { AuthService } from '../../application/auth-service'
import { SecurityDevicesService } from '../../application/security-devices-service'
import { container } from '../../composition-root'
import { DeviceDBModel } from '../../models'
import { ITokenPayload } from '../../shared'

const authService = container.resolve(AuthService)
const securityDevicesService = container.resolve(SecurityDevicesService)

export const checkRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.cookies.refreshToken) {
    return res.status(401).send({ message: 'Refresh token not found' })
  }

  const verifiedToken: ITokenPayload | null =
    await authService.checkRefreshToken(req.cookies.refreshToken)

  if (!verifiedToken) {
    return res.status(401).send({ message: 'Invalid refresh token' })
  }

  const device: DeviceDBModel | null =
    await securityDevicesService.findDeviceById(verifiedToken.deviceId)

  if (!device) return res.sendStatus(401)

  if (verifiedToken.iat < device.lastActiveDate) return res.sendStatus(401)

  return next()
}
