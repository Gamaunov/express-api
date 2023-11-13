import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { JwtService } from '../application/jwtService'
import { SecurityDevicesService } from '../application/security-devices-service'
import { DeviceViewModel } from '../models'
import { SecurityDevicesQueryRepository } from '../reposotories/query-repositories/security-devices-query-repository'
import { DeviceIdType, ITokenPayload, RequestWithParams } from '../shared'

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
    req: RequestWithParams<DeviceIdType>,
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