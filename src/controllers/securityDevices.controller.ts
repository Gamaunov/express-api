import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { JwtService } from '../application/jwt.service'
import { SecurityDevicesService } from '../application/securityDevices.service'
import { SecurityDevicesQueryRepository } from '../infrastructure/query/securityDevices.query.repository'
import { DeviceViewModel } from '../models'
import { URIParamsDeviceIdModel } from '../models/device/URIParamsDeviceIdModel'
import { ITokenPayload, RequestWithParams } from '../shared'

@injectable()
export class SecurityDevicesController {
  constructor(
    @inject(SecurityDevicesService)
    protected securityDevicesService: SecurityDevicesService,
    @inject(SecurityDevicesQueryRepository)
    protected securityDevicesQueryRepository: SecurityDevicesQueryRepository,
    @inject(JwtService) protected jwtService: JwtService,
  ) {}

  async getDevices(req: Request, res: Response) {
    const verifiedToken: ITokenPayload | null =
      await this.jwtService.verifyToken(req.cookies.refreshToken)

    if (!verifiedToken) return null

    const foundSessions: DeviceViewModel[] =
      await this.securityDevicesQueryRepository.getSessions(
        verifiedToken.userId.toString(),
      )

    return res.status(200).send(foundSessions)
  }

  async deleteDevice(
    req: RequestWithParams<URIParamsDeviceIdModel>,
    res: Response,
  ): Promise<void> {
    const isDeleted: boolean =
      await this.securityDevicesService.terminateSession(req.params.deviceId)

    isDeleted ? res.sendStatus(204) : res.sendStatus(404)
  }

  async deleteDevices(req: Request, res: Response) {
    const verifiedToken: ITokenPayload | null =
      await this.jwtService.verifyToken(req.cookies.refreshToken)

    if (!verifiedToken) return res.sendStatus(401)

    const isDeleted: boolean =
      await this.securityDevicesService.removeOutdatedDevices(
        verifiedToken.deviceId,
      )

    if (!isDeleted) return res.sendStatus(401)

    return res.sendStatus(204)
  }
}
