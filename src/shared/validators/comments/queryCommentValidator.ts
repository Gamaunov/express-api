import { CommentQueryModel } from '../../../models'
import { SortCommentFields } from '../../enums/comments/sortCommentFields'
import { SortDirections } from '../../enums/common/sortDirections'

function validateSortBy(sortBy: any): string {
  if (Object.values(SortCommentFields).includes(sortBy)) {
    return sortBy
  } else {
    return SortCommentFields.createdAt
  }
}

function validateNumber(n: any, def: number): number {
  if (typeof n === 'number' && Number.isInteger(n) && n >= 1) {
    return n
  } else {
    return def
  }
}
export function queryCommentValidator(query: any): CommentQueryModel {
  query.pageNumber = validateNumber(+query.pageNumber, 1)

  query.pageSize = validateNumber(+query.pageSize, 10)

  query.sortBy = validateSortBy(query.sortBy)

  query.sortDirection = query.sortDirection === SortDirections.asc ? 1 : -1

  return query
}
