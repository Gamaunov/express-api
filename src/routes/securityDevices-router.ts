import express from 'express'
import { Request, Response } from 'express'

import { jwtService } from '../application/jwtService'
import { securityDevicesService } from '../domain/securityDevices-service'
import { CheckRTMiddleware, DeviceIdMiddleware } from '../middlewares'
import { DeviceIdType, RequestWithParams } from '../shared'

export const securityDevicesRouter = () => {
  const router = express.Router()

  router.get('/', CheckRTMiddleware, async (req: Request, res: Response) => {
    const userId = await jwtService.getUserIdByToken(req.cookies.refreshToken)

    if (!userId) return res.sendStatus(400)

    const currentSession = await securityDevicesService.getAllDeviceSessions(
      userId.toString(),
    )

    return res.status(200).send(currentSession)
  })

  router.delete('/', CheckRTMiddleware, async (req: Request, res: Response) => {
    const user = await jwtService.getUserInfoByRT(req.cookies.refreshToken)

    if (!user) return res.sendStatus(400)

    const isDeleted: boolean =
      await securityDevicesService.terminateAllSessions(
        user.userId,
        user.deviceId,
      )

    if (!isDeleted) return res.sendStatus(400)

    return res.sendStatus(204)
  })

  router.delete(
    '/:deviceId',
    CheckRTMiddleware,
    DeviceIdMiddleware,
    async (req: RequestWithParams<DeviceIdType>, res: Response) => {
      const result = await securityDevicesService.terminateSession(
        req.params.deviceId,
      )

      result ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  return router
}
