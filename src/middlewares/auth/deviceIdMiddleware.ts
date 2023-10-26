import { NextFunction, Request, Response } from 'express'

import { jwtService } from '../../application/jwtService'
import { securityDevicesRepository } from '../../reposotories/securityDevices-repository'

export const DeviceIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const deviceId = req.params.deviceId
  const refreshToken = req.cookies.refreshToken
  console.log(req.params.deviceId)

  if (!deviceId) return res.sendStatus(404)
  if (!refreshToken) return res.sendStatus(404)

  const foundUserId =
    await securityDevicesRepository.findUserIdByDeviceId(deviceId)

  if (!foundUserId) return res.sendStatus(404)

  const user = await jwtService.getUserInfoByRT(refreshToken)

  if (!user) return res.sendStatus(400)

  if (deviceId === user.deviceId) return res.sendStatus(400)

  if (foundUserId !== user.userId) return res.sendStatus(403)

  return next()
}
