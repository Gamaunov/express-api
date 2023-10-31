import { PaginatorUserModel, UserQueryModel } from '../../models'
import { Users } from '../../schemas/userSchema'
import { loginEmailFilter, pagesCount, skipFn, userMapper } from '../../shared'

export const usersQueryRepository = {
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

      const users = await Users.find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)

      const userItems = users.map((u) => userMapper(u))

      const totalCount = await Users.countDocuments(filter)

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
}
