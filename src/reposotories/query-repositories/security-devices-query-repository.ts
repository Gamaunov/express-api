import { DeviceViewModel } from '../../models'
import { Devices } from '../../schemas/deviceSchema'
import { securityDevicesMapper } from '../../shared'

export const securityDevicesQueryRepository = {
  async getSessions(userId: string): Promise<DeviceViewModel[]> {
    const foundDevices = await Devices.find({ userId })
    return foundDevices.map((d) => securityDevicesMapper(d))
  },
}
