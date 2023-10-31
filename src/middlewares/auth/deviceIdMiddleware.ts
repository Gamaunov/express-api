import { NextFunction, Request, Response } from 'express'

import { jwtService } from '../../application/jwtService'
import { securityDevicesService } from '../../domain/security-devices-service'
import { DeviceDBModel } from '../../models'
import { ITokenPayload } from '../../shared'

export const DeviceIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.params.deviceId) return res.sendStatus(404)
  if (!req.cookies.refreshToken) return res.sendStatus(404)

  const foundDevice: DeviceDBModel | null =
    await securityDevicesService.findDeviceById(req.params.deviceId)

  if (!foundDevice) return res.sendStatus(404)

  const verifiedToken: ITokenPayload | null = await jwtService.verifyToken(
    req.cookies.refreshToken,
  )

  if (!verifiedToken) return res.sendStatus(400)

  if (req.params.deviceId === verifiedToken.deviceId) return res.sendStatus(400)

  if (foundDevice.userId !== verifiedToken.userId.toString())
    return res.sendStatus(403)

  return next()
}
