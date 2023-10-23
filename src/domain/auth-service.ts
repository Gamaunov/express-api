import bcrypt from 'bcrypt'
import add from 'date-fns/add'
import Jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

import { usersCollection } from '../db/db'
import { emailManager } from '../managers/email-manager'
import { UserAccountDBModel } from '../models'
import { MappedUserModel } from '../models'
import { usersRepository } from '../reposotories/users-repository'
import { settings } from '../settings'
import { ITokenData } from '../shared'

export const authService = {
  async createUser(
    login: string,
    email: string,
    password: string,
  ): Promise<MappedUserModel | null> {
    const passwordHash = await this._generateHash(password)

    const newUser: UserAccountDBModel = {
      _id: new ObjectId(),
      accountData: {
        login,
        email,
        passwordHash,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 8,
          minutes: 30,
        }),
        isConfirmed: false,
      },
      refreshTokenBlackList: [],
    }

    const createResult = await usersRepository.createUser(newUser)

    try {
      await emailManager.sendEmailConfirmationMessage(
        newUser.accountData.email,
        newUser.emailConfirmation.confirmationCode,
      )
    } catch (e) {
      console.error(e)
      await usersRepository.deleteUser(newUser._id.toHexString())
      return null
    }

    return createResult
  },

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepository.findLoginOrEmail(loginOrEmail)

    if (!user) return null

    if (!user.emailConfirmation.isConfirmed) return null

    const isHashesEquals = await this._isPasswordCorrect(
      password,
      user.accountData.passwordHash,
    )

    return isHashesEquals ? user : null
  },

  async _generateHash(password: string) {
    return await bcrypt.hash(password, 10)
  },

  async _isPasswordCorrect(password: string, hash: string) {
    return bcrypt.compare(password, hash)
  },

  async checkRefreshToken(token: string) {
    try {
      return Jwt.verify(token, settings.JWT_SECRET) as ITokenData
    } catch (e) {
      console.log(e)
      return null
    }
  },

  async findTokenInBlackList(
    userId: ObjectId,
    token: string,
  ): Promise<boolean> {
    const result = await usersCollection.findOne({
      _id: userId,
      refreshTokenBlackList: { $in: [token] },
    })

    return !!result
  },

  async refreshTokens(
    userId: ObjectId,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    try {
      const accessToken = Jwt.sign({ userId }, settings.JWT_SECRET, {
        expiresIn: '10s',
      })

      const newRefreshToken = Jwt.sign({ userId }, settings.JWT_SECRET, {
        expiresIn: '20s',
      })

      return { accessToken, newRefreshToken }
    } catch (error) {
      throw new Error('Failed to refresh tokens')
    }
  },

  async checkAndFindUserByToken(token: string) {},

  async confirmEmail(code: string) {
    let user = await usersRepository.findUserByConfirmationCode(code)

    if (!user) return false

    if (user.emailConfirmation.isConfirmed) return false

    if (user.emailConfirmation.expirationDate < new Date()) return false

    return await usersRepository.updateConfirmation(user._id)
  },

  async findUserByEmail(email: string): Promise<UserAccountDBModel | null> {
    return await usersRepository.findUserByEmail(email)
  },

  async resendConfirmationCode(
    email: string,
  ): Promise<UserAccountDBModel | null> {
    const user = await this.findUserByEmail(email)

    if (!user) return null

    const newCode = uuidv4()

    const isUpdated = await usersRepository.updateConfirmationCode(
      user._id,
      newCode,
    )

    return isUpdated ? await usersRepository.findUserByEmail(email) : null
  },
}
