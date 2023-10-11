import { UserOutput } from '../../../db/dbTypes'

export type PaginatorUserModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: UserOutput[]
}
