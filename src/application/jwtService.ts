import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { UserDBModel } from '../models'
import { settings } from '../settings'
import { ITokenPayload } from '../shared'

export const jwtService = {
  async createAccessToken(
    user: UserDBModel,
    deviceId: string = uuidv4(),
  ): Promise<string> {
    return jwt.sign({ userId: user._id, deviceId }, settings.JWT_SECRET, {
      expiresIn: '10s',
    })
  },

  async createRefreshToken(
    user: UserDBModel,
    deviceId: string = uuidv4(),
  ): Promise<string> {
    return jwt.sign({ userId: user._id, deviceId }, settings.JWT_SECRET, {
      expiresIn: '20s',
    })
  },

  async verifyToken(token: string): Promise<ITokenPayload | null> {
    try {
      return jwt.verify(token, settings.JWT_SECRET) as ITokenPayload
    } catch (error) {
      return null
    }
  },
}
