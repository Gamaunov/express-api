import { MappedCommentModel } from './MappedCommentModel'

export type PaginatorCommentModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: MappedCommentModel[]
}
