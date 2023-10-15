import { MappedUserModel } from './MappedUserModel'

export type PaginatorUserModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: MappedUserModel[]
}
