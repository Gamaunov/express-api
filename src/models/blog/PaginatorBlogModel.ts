import { BlogOutputModel } from './BlogOutputModel'

export type PaginatorBlogModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: BlogOutputModel[]
}
