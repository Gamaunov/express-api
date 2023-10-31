import { DeleteResult, ObjectId } from 'mongodb'
import { UpdateWriteOpResult } from 'mongoose'

import { UserDBModel, UserViewModel } from '../models'
import { Users } from '../schemas/userSchema'

export const usersRepository = {
  async getUserById(_id: ObjectId): Promise<UserDBModel | null> {
    const foundUser = await Users.findOne({ _id })

    return foundUser ? foundUser : null
  },

  async findUserByEmailConfirmationCode(
    code: string,
  ): Promise<UserDBModel | null> {
    const foundUser = await Users.findOne({
      'emailConfirmation.confirmationCode': code,
    })

    return foundUser ? foundUser : null
  },

  async findUserByPasswordRecoveryCode(
    code: string,
  ): Promise<UserDBModel | null> {
    const foundUser = await Users.findOne({
      'passwordRecovery.recoveryCode': code,
    })

    return foundUser ? foundUser : null
  },

  async updatePasswordRecovery(
    _id: ObjectId,
    recoveryCode: string,
    expirationDate: Date,
  ): Promise<boolean> {
    const result: UpdateWriteOpResult = await Users.updateOne(
      { _id },
      {
        $set: {
          'passwordRecovery.recoveryCode': recoveryCode,
          'passwordRecovery.expirationDate': expirationDate,
        },
      },
    )
    return result.modifiedCount === 1
  },

  async updatePassword(_id: ObjectId, passwordHash: string): Promise<boolean> {
    const result: UpdateWriteOpResult = await Users.updateOne(
      { _id },
      {
        $set: {
          'accountData.password': passwordHash,
          'passwordRecovery.recoveryCode': null,
          'passwordRecovery.expirationDate': null,
        },
      },
    )
    return result.modifiedCount === 1
  },

  async updateEmailConfirmationStatus(_id: ObjectId): Promise<boolean> {
    const result: UpdateWriteOpResult = await Users.updateOne(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    )
    return result.modifiedCount === 1
  },

  async createUser(newUser: UserDBModel): Promise<UserViewModel> {
    const user = await Users.create(newUser)

    return {
      id: user._id.toString(),
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    }
  },

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDBModel | null> {
    return Users.findOne({
      $or: [
        { 'accountData.login': loginOrEmail },
        { 'accountData.email': loginOrEmail },
      ],
    })
  },

  async findUserByEmail(email: string): Promise<UserDBModel | null> {
    const user = await Users.findOne({
      'accountData.email': email,
    })

    return user ? user : null
  },

  async findUserByLogin(login: string): Promise<UserDBModel | null> {
    const user = await Users.findOne({
      'accountData.login': login,
    })

    return user ? user : null
  },

  async updateConfirmationCode(
    userId: ObjectId,
    code: string,
  ): Promise<boolean> {
    const result: UpdateWriteOpResult = await Users.updateOne(
      { _id: userId },
      {
        $set: {
          'emailConfirmation.confirmationCode': code,
        },
      },
    )

    return result.modifiedCount === 1
  },

  async deleteUser(_id: ObjectId): Promise<boolean> {
    const result: DeleteResult = await Users.deleteOne({ _id })

    return result.deletedCount === 1
  },

  async deleteAllUsers(): Promise<void> {
    try {
      await Users.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
