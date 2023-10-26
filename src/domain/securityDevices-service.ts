import { DeviceViewModel } from '../models'
import { securityDevicesRepository } from '../reposotories/securityDevices-repository'

export const securityDevicesService = {
  async getAllDeviceSessions(userId: string): Promise<DeviceViewModel[]> {
    return await securityDevicesRepository.getAllDeviceSessions(userId)
  },

  async terminateAllSessions(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    return await securityDevicesRepository.terminateAllSessions(
      userId,
      deviceId,
    )
  },

  async terminateSession(deviceId: string) {
    return await securityDevicesRepository.terminateSession(deviceId)
  },
}
