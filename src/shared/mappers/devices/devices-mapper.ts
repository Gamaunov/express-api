import { DeviceDBModel, DeviceViewModel } from '../../../models'

export const sessionMapper = (device: DeviceDBModel): DeviceViewModel => {
  return {
    ip: device.ip,
    title: device.deviceName,
    lastActiveDate: new Date(device.issuedAt * 1000).toISOString(),
    deviceId: device.deviceId,
  }
}
