import { injectable } from 'inversify'

import { SecurityDeviceMongooseModel } from '../../domain/SecurityDeviceSchema'
import { DeviceViewModel } from '../../models'
import { securityDevicesMapper } from '../../shared'

@injectable()
export class SecurityDevicesQueryRepository {
  async getSessions(userId: string): Promise<DeviceViewModel[]> {
    const foundDevices = await SecurityDeviceMongooseModel.find({ userId })
    return foundDevices.map((d) => securityDevicesMapper(d))
  }
}
