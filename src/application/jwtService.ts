import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

import { UserAccountDBModel } from '../models'
import { settings } from '../settings'

export const jwtService = {
  async createJWT(user: UserAccountDBModel) {
    return jwt.sign({ userId: user._id }, settings.JWT_SECRET, {
      expiresIn: '10d',
    })
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET)

      return new ObjectId(result.userId)
    } catch (e) {
      return null
    }
  },
}
