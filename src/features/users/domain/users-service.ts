import bcrypt from 'bcrypt'

import { queryUserValidator } from '../helpers/validators/query-user-validator'
import { CreateUserModel } from '../models/CreatUserModel'
import { MappedUserModel } from '../models/MappedUserModel'
import { PaginatorUserModel } from '../models/PaginatorUserModel'
import { UserQueryModel } from '../models/UserQueryModel'
import { usersRepository } from '../repository/users-repository'

export const usersService = {
  async getAllUsers(data: UserQueryModel): Promise<PaginatorUserModel | null> {
    const queryData = queryUserValidator(data)

    return await usersRepository.getAllUsers(queryData)
  },

  async createUser(data: CreateUserModel): Promise<MappedUserModel> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(data.password, passwordSalt)

    const newUser = {
      login: data.login,
      email: data.email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
    }

    return await usersRepository.createUser(newUser)
  },

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepository.findLoginOrEmail(loginOrEmail)

    if (!user) return false

    const passwordHash = await this._generateHash(password, user.passwordSalt)

    return user.passwordHash === passwordHash
  },

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
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
