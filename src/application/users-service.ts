import bcrypt from 'bcrypt'
import { inject, injectable } from 'inversify'
import { ObjectId } from 'mongodb'

import {
  CreateUserModel,
  UserDBModel,
  UserModel,
  UserViewModel,
} from '../models'
import { UsersRepository } from '../reposotories/users-repository'

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) protected usersRepository: UsersRepository,
  ) {}
  async getUserById(_id: ObjectId): Promise<UserModel | null> {
    return await this.usersRepository.getUserById(_id)
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserModel | null> {
    return await this.usersRepository.findUserByLoginOrEmail(loginOrEmail)
  }

  async createUser(data: CreateUserModel): Promise<UserViewModel> {
    const passwordHash: string = await bcrypt.hash(data.password, 10)

    const newUser: UserDBModel = new UserDBModel(
      new ObjectId(),
      {
        login: data.login,
        passwordHash,
        email: data.email,
        createdAt: new Date().toISOString(),
        isMembership: false,
      },
      {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: true,
      },
      {
        recoveryCode: null,
        expirationDate: null,
      },
    )

    return await this.usersRepository.createUser(newUser)
  }

  async findUserByEmailConfirmationCode(
    code: string,
  ): Promise<UserModel | null> {
    return this.usersRepository.findUserByEmailConfirmationCode(code)
  }

  async findUserByPasswordRecoveryCode(
    code: string,
  ): Promise<UserModel | null> {
    return this.usersRepository.findUserByPasswordRecoveryCode(code)
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteUser(new ObjectId(id))
  }

  async deleteAllUsers(): Promise<boolean> {
    return await this.usersRepository.deleteAllUsers()
  }
}
