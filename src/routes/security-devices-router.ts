import express from 'express'
import { Request, Response } from 'express'

import { jwtService } from '../application/jwtService'
import { securityDevicesService } from '../domain/security-devices-service'
import { checkForRefreshToken, deviceIdMiddleware } from '../middlewares'
import { DeviceViewModel } from '../models'
import { securityDevicesQueryRepository } from '../reposotories/query-repositories/security-devices-query-repository'
import { DeviceIdType, ITokenPayload, RequestWithParams } from '../shared'

export const securityDevicesRouter = () => {
  const router = express.Router()

  router.get('/', checkForRefreshToken, async (req: Request, res: Response) => {
    const verifiedToken: ITokenPayload | null = await jwtService.verifyToken(
      req.cookies.refreshToken,
    )

    if (!verifiedToken) return null

    const foundSessions: DeviceViewModel[] =
      await securityDevicesQueryRepository.getSessions(
        verifiedToken.userId.toString(),
      )

    return res.status(200).send(foundSessions)
  })

  router.delete(
    '/:deviceId',
    deviceIdMiddleware,
    async (
      req: RequestWithParams<DeviceIdType>,
      res: Response,
    ): Promise<void> => {
      const isDeleted: boolean = await securityDevicesService.terminateSession(
        req.params.deviceId,
      )

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  router.delete('/', checkForRefreshToken, async (req: Request, res: Response) => {
    const verifiedToken: ITokenPayload | null = await jwtService.verifyToken(
      req.cookies.refreshToken,
    )

    if (!verifiedToken) return res.sendStatus(401)

    const isDeleted: boolean =
      await securityDevicesService.removeOutdatedDevices(
        verifiedToken.deviceId,
      )

    if (!isDeleted) return res.sendStatus(401)

    return res.sendStatus(204)
  })

  return router
}
