import { queryUserValidator } from '../helpers/validators/query-user-validator'
import { CreateUserModel } from '../models/CreatUserModel'
import { PaginatorUserModel } from '../models/PaginatorUserModel'
import { UserQueryModel } from '../models/UserQueryModel'
import { UserViewModel } from '../models/UserViewModel'
import { usersRepository } from '../repository/users-repository'

export const usersService = {
  async getAllUsers(data: UserQueryModel): Promise<PaginatorUserModel | null> {
    const queryData = queryUserValidator(data)

    return await usersRepository.getAllUsers(queryData)
  },

  async createUser(data: CreateUserModel): Promise<UserViewModel> {
    const newUser = {
      login: data.login,
      email: data.email,
      createdAt: new Date().toISOString(),
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
