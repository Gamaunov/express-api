import mongoose from 'mongoose'

import { DeviceDBModel } from '../models'

const deviceSchema = new mongoose.Schema<DeviceDBModel>({
  ip: { type: String, required: true },
  title: { type: String, required: true },
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  lastActiveDate: { type: Number, required: true },
  expirationDate: { type: Number, required: true },
})

export const Devices = mongoose.model('devices', deviceSchema)
