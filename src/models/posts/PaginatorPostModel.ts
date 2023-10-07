import { PostOutput } from '../../db/dbTypes'

export type PaginatorPostModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: PostOutput[]
}
