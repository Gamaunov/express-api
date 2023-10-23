import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

import { UserAccountDBModel } from '../models'
import { settings } from '../settings'
import { ITokenData } from '../shared'

export const jwtService = {
  async createJWT(user: UserAccountDBModel) {
    return jwt.sign({ userId: user._id }, settings.JWT_SECRET, {
      expiresIn: '10s',
    })
  },

  async getUserIdByToken(token: string) {
    try {
      const result = jwt.verify(token, settings.JWT_SECRET) as ITokenData

      return new ObjectId(result.userId)
    } catch (e) {
      return null
    }
  },

  async createRefreshToken(user: UserAccountDBModel) {
    return jwt.sign({ userId: user._id }, settings.JWT_SECRET, {
      expiresIn: '20s',
    })
  },
}
