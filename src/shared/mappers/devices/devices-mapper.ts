import { DeviceDBModel, DeviceViewModel } from '../../../models'

export const securityDevicesMapper = (
  device: DeviceDBModel,
): DeviceViewModel => {
  return {
    ip: device.ip,
    title: device.title,
    lastActiveDate: new Date(device.lastActiveDate * 1000).toISOString(),
    deviceId: device.deviceId,
  }
}
