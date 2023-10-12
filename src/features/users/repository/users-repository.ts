import { ObjectId, WithId } from 'mongodb'

import { usersCollection } from '../../../db/db'
import { pagesCount, skipFn } from '../../../shared'
import { loginEmailFilter } from '../helpers/filters/login-email-filter'
import { userMapper } from '../helpers/mappers/user-mapper'
import { MappedUserModel } from '../models/MappedUserModel'
import { PaginatorUserModel } from '../models/PaginatorUserModel'
import { UserQueryModel } from '../models/UserQueryModel'
import { UserViewModel } from '../models/UserViewModel'

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

      const users: WithId<UserViewModel>[] = await usersCollection
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

  async createUser(newPost: UserViewModel): Promise<MappedUserModel> {
    const res = await usersCollection.insertOne({ ...newPost })

    return userMapper({ ...newPost, _id: res.insertedId })
  },

  async findLoginOrEmail(loginOrEmail: string) {
    return await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    })
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
