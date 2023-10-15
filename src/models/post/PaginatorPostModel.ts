import { PostOutputModel } from './PostOutputModel'

export type PaginatorPostModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: PostOutputModel[]
}
