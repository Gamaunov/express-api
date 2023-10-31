import bcrypt from 'bcrypt'
import add from 'date-fns/add'
import Jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

import { emailManager } from '../managers/email-manager'
import { UserDBModel, UserViewModel } from '../models'
import { MappedUserModel } from '../models'
import { usersRepository } from '../reposotories/users-repository'
import { settings } from '../settings'
import { ITokenPayload } from '../shared'
import { usersService } from './users-service'

export const authService = {
  async createUser(
    login: string,
    email: string,
    password: string,
  ): Promise<MappedUserModel | null> {
    const passwordHash: string = await this._generateHash(password)

    const newUser: UserDBModel = {
      _id: new ObjectId(),
      accountData: {
        login,
        email,
        passwordHash,
        isMembership: false,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 8,
          minutes: 30,
        }),
        isConfirmed: false,
      },
      passwordRecovery: {
        recoveryCode: null,
        expirationDate: null,
      },
    }

    const createdUser: UserViewModel = await usersRepository.createUser(newUser)

    try {
      await emailManager.sendEmailConfirmationMessage(
        newUser.accountData.email,
        newUser.emailConfirmation.confirmationCode!,
      )
    } catch (e) {
      console.error(e)
      await usersRepository.deleteUser(new ObjectId(newUser._id))
      return null
    }

    return createdUser
  },

  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDBModel | null> {
    const user: UserDBModel | null =
      await usersService.findUserByLoginOrEmail(loginOrEmail)

    if (!user) return null

    if (!user.emailConfirmation.isConfirmed) return null

    const isHashesEquals: boolean = await this._isPasswordCorrect(
      password,
      user.accountData.passwordHash,
    )

    return isHashesEquals ? user : null
  },

  async _generateHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  },

  async _isPasswordCorrect(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  },

  async checkRefreshToken(token: string): Promise<ITokenPayload | null> {
    try {
      return Jwt.verify(token, settings.JWT_SECRET) as ITokenPayload
    } catch (e) {
      console.log(e)
      return null
    }
  },

  async sendPasswordRecoveryCode(email: string): Promise<boolean> {
    const user: UserDBModel | null =
      await usersService.findUserByLoginOrEmail(email)

    if (!user) return false

    const recoveryCode: string = uuidv4()
    const expirationDate: Date = add(new Date(), {
      hours: 1,
    })

    const updatedPassword: boolean =
      await usersRepository.updatePasswordRecovery(
        user._id,
        recoveryCode,
        expirationDate,
      )

    try {
      await emailManager.sendPasswordRecoveryMessage(
        email,
        'Password recovery',
        recoveryCode,
      )
    } catch (e) {
      console.error(e)
      return false
    }
    return updatedPassword
  },

  async confirmEmail(code: string): Promise<boolean> {
    const user: UserDBModel | null =
      await usersService.findUserByEmailConfirmationCode(code)

    if (!user) return false

    if (user.emailConfirmation.isConfirmed) return false

    if (user.emailConfirmation.expirationDate! < new Date()) return false

    return await usersRepository.updateEmailConfirmationStatus(user._id)
  },

  async findUserByEmail(email: string): Promise<UserDBModel | null> {
    return await usersRepository.findUserByEmail(email)
  },

  async resendConfirmationCode(email: string): Promise<boolean | null> {
    const user: UserDBModel | null = await this.findUserByEmail(email)

    if (!user) return null

    const newCode: string = uuidv4()

    try {
      await emailManager.sendEmailConfirmationMessage(
        user.accountData.email,
        newCode,
      )
    } catch (e) {
      return null
    }

    return usersRepository.updateConfirmationCode(user._id, newCode)
  },

  async changePassword(
    recoveryCode: string,
    password: string,
  ): Promise<boolean> {
    const user: UserDBModel | null =
      await usersService.findUserByPasswordRecoveryCode(recoveryCode)

    if (!user) return false

    const passwordHash: string = await this._generateHash(password)

    return usersRepository.updatePassword(user._id, passwordHash)
  },
}
