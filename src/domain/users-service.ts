import { ObjectId } from 'mongodb'

import { CreateUserModel, UserDBModel, UserViewModel } from '../models'
import { usersRepository } from '../reposotories/users-repository'
import { authService } from './auth-service'

export const usersService = {
  async getUserById(_id: ObjectId): Promise<UserDBModel | null> {
    return await usersRepository.getUserById(_id)
  },

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDBModel | null> {
    return await usersRepository.findUserByLoginOrEmail(loginOrEmail)
  },

  async createUser(data: CreateUserModel): Promise<UserViewModel> {
    const passwordHash: string = await authService._generateHash(data.password)

    const newUser: UserDBModel = {
      _id: new ObjectId(),
      accountData: {
        login: data.login,
        passwordHash,
        email: data.email,
        createdAt: new Date().toISOString(),
        isMembership: false,
      },
      emailConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: true,
      },
      passwordRecovery: {
        recoveryCode: null,
        expirationDate: null,
      },
    }

    return await usersRepository.createUser(newUser)
  },

  async findUserByEmailConfirmationCode(
    code: string,
  ): Promise<UserDBModel | null> {
    return usersRepository.findUserByEmailConfirmationCode(code)
  },

  async findUserByPasswordRecoveryCode(
    code: string,
  ): Promise<UserDBModel | null> {
    return usersRepository.findUserByPasswordRecoveryCode(code)
  },

  async deleteUser(id: string): Promise<boolean> {
    return usersRepository.deleteUser(new ObjectId(id))
  },

  async deleteAllUsers(): Promise<void> {
    try {
      await usersRepository.deleteAllUsers()
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
