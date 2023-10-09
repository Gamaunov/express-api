import { BlogOutput } from '../../../db/dbTypes'

export type PaginatorBlogModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: BlogOutput[]
}
