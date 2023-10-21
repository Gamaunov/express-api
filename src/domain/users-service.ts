import add from 'date-fns/add'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

import {
  CreateUserModel,
  MappedUserModel,
  PaginatorUserModel,
  UserAccountDBModel,
  UserQueryModel,
} from '../models'
import { usersRepository } from '../reposotories/users-repository'
import { queryUserValidator } from '../shared'
import { authService } from './auth-service'

export const usersService = {
  async getAllUsers(data: UserQueryModel): Promise<PaginatorUserModel | null> {
    const queryData = queryUserValidator(data)

    return await usersRepository.getAllUsers(queryData)
  },

  async getUserById(userId: ObjectId): Promise<UserAccountDBModel | null> {
    return await usersRepository.getUserById(userId)
  },

  async createUser(data: CreateUserModel): Promise<MappedUserModel> {
    const passwordHash = await authService._generateHash(data.password)

    const newUser: UserAccountDBModel = {
      _id: new ObjectId(),
      accountData: {
        login: data.login,
        email: data.email,
        passwordHash,
        createdAt: new Date(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 8,
          minutes: 30,
        }),
        isConfirmed: true,
      },
    }

    return await usersRepository.createUser(newUser)
  },

  async deleteUser(id: string): Promise<boolean> {
    return usersRepository.deleteUser(id)
  },

  async deleteAllUsers() {
    try {
      await usersRepository.deleteAllUsers()
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
