import { ObjectId } from 'mongodb'

import { usersCollection } from '../db/db'
import { MappedUserModel, PaginatorUserModel, UserQueryModel } from '../models'
import { UserAccountDBModel } from '../models'
import { loginEmailFilter, pagesCount, skipFn, userMapper } from '../shared'

export const usersRepository = {
  async getAllUsers(
    queryData: UserQueryModel,
  ): Promise<PaginatorUserModel | null> {
    try {
      const filter = loginEmailFilter(
        queryData.searchLoginTerm,
        queryData.searchEmailTerm,
      )

      const sortCriteria: { [key: string]: any } = {
        [queryData.sortBy as string]: queryData.sortDirection,
      }

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize

      const users: UserAccountDBModel[] = await usersCollection
        .find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)
        .toArray()

      const userItems = users.map((u) => userMapper(u))

      const totalCount = await usersCollection.countDocuments(filter)

      return {
        pagesCount: pagesCount(totalCount, queryData.pageSize!),
        page: queryData.pageNumber!,
        pageSize: queryData.pageSize!,
        totalCount: totalCount,
        items: userItems,
      }
    } catch (e) {
      console.log(e)
      return null
    }
  },

  async getUserById(id: ObjectId | string): Promise<UserAccountDBModel | null> {
    return usersCollection.findOne({ _id: new ObjectId(id) })
  },

  async updateConfirmation(_id: ObjectId): Promise<boolean> {
    const result = await usersCollection.updateOne(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    )

    return result.modifiedCount === 1
  },

  async createUser(newUser: UserAccountDBModel): Promise<MappedUserModel> {
    const res = await usersCollection.insertOne(newUser)

    return userMapper({ ...newUser, _id: res.insertedId })
  },

  async findLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserAccountDBModel | null> {
    return usersCollection.findOne({
      $or: [
        { 'accountData.login': loginOrEmail },
        { 'accountData.email': loginOrEmail },
      ],
    })
  },

  async findUserByEmail(email: string): Promise<UserAccountDBModel | null> {
    return await usersCollection.findOne({
      'accountData.email': email,
    })
  },

  async findUserByLogin(login: string): Promise<UserAccountDBModel | null> {
    return await usersCollection.findOne({
      'accountData.login': login,
    })
  },

  async findUserByConfirmationCode(
    code: string,
  ): Promise<UserAccountDBModel | null> {
    return await usersCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    })
  },

  async updateConfirmationCode(
    userId: ObjectId,
    code: string,
  ): Promise<boolean> {
    const result = await usersCollection.updateOne(
      { _id: userId },
      {
        $set: {
          'emailConfirmation.confirmationCode': code,
        },
      },
    )

    return result.modifiedCount === 1
  },

  async deleteUser(id: string): Promise<boolean> {
    const isUserDeleted = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    })

    return isUserDeleted.deletedCount === 1
  },

  async deleteAllUsers() {
    try {
      await usersCollection.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
