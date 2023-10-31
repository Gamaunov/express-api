import { DeleteResult, UpdateResult } from 'mongodb'

import { DeviceDBModel, DeviceViewModel } from '../models'
import { Devices } from '../schemas/deviceSchema'

export const securityDevicesRepository = {
  async findDeviceById(deviceId: string): Promise<DeviceDBModel | null> {
    return Devices.findOne({ deviceId })
  },

  async createDevice(device: DeviceDBModel): Promise<DeviceViewModel> {
    await Devices.create(device)

    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate.toString(),
      deviceId: device.deviceId,
    }
  },

  async updateDevice(
    ip: string,
    userId: string,
    issuedAt: number,
  ): Promise<boolean> {
    const result: UpdateResult = await Devices.updateOne(
      { userId },
      {
        $set: {
          lastActiveDate: issuedAt,
          ip,
        },
      },
    )

    return result.matchedCount === 1
  },

  async terminateSession(deviceId: string): Promise<boolean> {
    const result: DeleteResult = await Devices.deleteOne({ deviceId })

    return result.deletedCount === 1
  },

  async removeOutdatedDevices(currentDevice: string): Promise<boolean> {
    await Devices.deleteMany({ deviceId: { $ne: currentDevice } })

    return (await Devices.countDocuments()) === 1
  },

  async deleteAllDevices(): Promise<boolean> {
    await Devices.deleteMany({})

    return (await Devices.countDocuments()) === 0
  },
}
