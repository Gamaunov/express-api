import { ObjectId } from 'mongodb'

import { jwtService } from '../application/jwtService'
import { DeviceDBModel, DeviceViewModel } from '../models'
import { securityDevicesRepository } from '../reposotories/security-devices-repository'
import { ITokenPayload } from '../shared'

export const securityDevicesService = {
  async findDeviceById(deviceId: string): Promise<DeviceDBModel | null> {
    return securityDevicesRepository.findDeviceById(deviceId)
  },

  async createDevice(
    newRefreshToken: string,
    ip: string,
    userAgent: string,
  ): Promise<DeviceViewModel | null> {
    const verifiedToken: ITokenPayload | null =
      await jwtService.verifyToken(newRefreshToken)

    if (!verifiedToken) return null

    const newDevice = {
      _id: new ObjectId(),
      ip,
      title: userAgent,
      userId: verifiedToken.userId.toString(),
      deviceId: verifiedToken.deviceId,
      lastActiveDate: verifiedToken.iat,
      expirationDate: verifiedToken.exp,
    }

    return securityDevicesRepository.createDevice(newDevice)
  },

  async updateDevice(
    ip: string,
    userId: string,
    issuedAt: number,
  ): Promise<boolean> {
    return securityDevicesRepository.updateDevice(ip, userId, issuedAt)
  },

  async terminateSession(deviceId: string): Promise<boolean> {
    return securityDevicesRepository.terminateSession(deviceId)
  },

  async removeOutdatedDevices(currentDevice: string): Promise<boolean> {
    return securityDevicesRepository.removeOutdatedDevices(currentDevice)
  },
}
