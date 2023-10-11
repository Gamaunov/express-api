import { ObjectId, WithId } from 'mongodb'

import { usersCollection } from '../../../db/db'
import { pagesCount, skipFn } from '../../../shared'
import { userMapper } from '../helpers/mappers/user-mapper'
import { PaginatorUserModel } from '../models/PaginatorUserModel'
import { UserQueryModel } from '../models/UserQueryModel'
import { UserViewModel } from '../models/UserViewModel'

export const usersRepository = {
  async getAllUsers(
    queryData: UserQueryModel,
  ): Promise<PaginatorUserModel | null> {
    try {
      const filter = {
        name: { $regex: queryData.searchEmailTerm ?? '', $options: 'i' },
      }

      const sortByProperty: string = queryData.sortBy as string
      const sortDirection: number = queryData.sortDirection as number
      const sortCriteria: { [key: string]: any } = {
        [sortByProperty]: sortDirection,
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

  async createUser(newPost: UserViewModel): Promise<UserViewModel> {
    const res = await usersCollection.insertOne({ ...newPost })

    return userMapper({ ...newPost, _id: res.insertedId })
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
