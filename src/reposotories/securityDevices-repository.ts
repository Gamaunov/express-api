import { devicesCollection, loginAttemptsCollection } from '../db/db'
import { DeviceViewModel } from '../models'
import { sessionMapper } from '../shared'

export const securityDevicesRepository = {
  async getLAByURLAndIp(ip: string, url: string, date: Date) {
    const count = loginAttemptsCollection.find({
      IP: ip,
      URL: url,
      date: { $gt: date },
    })

    const documents = await count.toArray()

    return documents.length
  },

  async createLA(IP: string, URL: string, date: Date) {
    const attempt = {
      IP,
      URL,
      date,
    }

    return await loginAttemptsCollection.insertOne({ ...attempt })
  },

  async getAllDeviceSessions(userId: string): Promise<DeviceViewModel[]> {
    const sessions = devicesCollection.find({
      userId: userId,
      issuedAt: { $ne: 0 },
    })

    const sessionsArray = await sessions.toArray()

    return sessionsArray.map((s) => sessionMapper(s))
  },

  async terminateAllSessions(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await devicesCollection.deleteMany({
      $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }],
    })

    return result.deletedCount >= 1
  },

  async terminateSession(deviceId: string): Promise<boolean> {
    const result = await devicesCollection.deleteOne({
      deviceId: deviceId,
    })

    return result.deletedCount >= 1
  },

  async findUserIdByDeviceId(deviceId: string): Promise<string | null> {
    const user = await devicesCollection.findOne({
      deviceId: deviceId,
    })

    if (user) return user.userId

    return null
  },

  async deleteAllDevices() {
    try {
      await devicesCollection.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
