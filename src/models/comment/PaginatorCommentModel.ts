import { CommentViewModel } from './CommentViewModel'

export type PaginatorCommentModel = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: CommentViewModel[]
}
