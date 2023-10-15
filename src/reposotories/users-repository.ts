import { ObjectId, WithId } from 'mongodb'

import { usersCollection } from '../db/db'
import {
  MappedUserModel,
  PaginatorUserModel,
  UserDBTypeModel,
  UserQueryModel,
  UserViewModel,
} from '../models'
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

  async getUserById(id: ObjectId): Promise<UserDBTypeModel | null> {
    return usersCollection.findOne({ _id: id })
  },

  // async createBlog(newBlog: BlogViewModel): Promise<BlogViewModel> {
  //   const res = await blogsCollection.insertOne({ ...newBlog })
  //
  //   return blogMapper({ ...newBlog, _id: res.insertedId })
  // },

  async createUser(newPost: UserViewModel): Promise<MappedUserModel> {
    const res = await usersCollection.insertOne({ ...newPost })

    return userMapper({ ...newPost, _id: res.insertedId })
  },

  async findLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDBTypeModel | null> {
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
