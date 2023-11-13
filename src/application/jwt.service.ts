import { injectable } from 'inversify'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { UserModel } from '../models'
import { settings } from '../settings'
import { ITokenPayload } from '../shared'

@injectable()
export class JwtService {
  async createAccessToken(
    user: UserModel,
    deviceId: string = uuidv4(),
  ): Promise<string> {
    return jwt.sign({ userId: user._id, deviceId }, settings.JWT_SECRET, {
      expiresIn: '4h',
    })
  }

  async createRefreshToken(
    user: UserModel,
    deviceId: string = uuidv4(),
  ): Promise<string> {
    return jwt.sign({ userId: user._id, deviceId }, settings.JWT_SECRET, {
      expiresIn: '8h',
    })
  }

  async verifyToken(token: string): Promise<ITokenPayload | null> {
    try {
      return jwt.verify(token, settings.JWT_SECRET) as ITokenPayload
    } catch (error) {
      return null
    }
  }
}
