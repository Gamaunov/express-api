import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

import { UserAccountDBModel } from '../models'
import { settings } from '../settings'
import { ITokenData } from '../shared'
import { IRTokenInfo } from '../shared'

export const jwtService = {
  async createJWT(user: UserAccountDBModel): Promise<string> {
    return jwt.sign({ userId: user._id }, settings.JWT_SECRET, {
      expiresIn: '10s',
    })
  },

  async getUserIdByToken(token: string): Promise<ObjectId | null> {
    try {
      const result = jwt.verify(token, settings.JWT_SECRET) as ITokenData

      return new ObjectId(result.userId)
    } catch (e) {
      return null
    }
  },

  async createRefreshToken(
    user: UserAccountDBModel,
    deviceId: string,
  ): Promise<string> {
    return jwt.sign(
      { userId: user._id, deviceId: deviceId },
      settings.JWT_SECRET,
      {
        expiresIn: '20s',
      },
    )
  },

  async getUserInfoByRT(token: string): Promise<IRTokenInfo | null> {
    try {
      return jwt.verify(token, settings.JWT_SECRET) as IRTokenInfo
    } catch (e) {
      console.log(e)
      return null
    }
  },
}
