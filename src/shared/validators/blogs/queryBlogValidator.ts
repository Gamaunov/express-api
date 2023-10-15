import { BlogQueryModel } from '../../../models'
import { SortBlogFields } from '../../enums/blogs/sortBlogFields'
import { SortDirections } from '../../index'

function validateSortBy(sortBy: any): string {
  if (Object.values(SortBlogFields).includes(sortBy)) {
    return sortBy
  } else {
    return SortBlogFields.createdAt
  }
}

function validateNumber(n: any, def: number): number {
  if (typeof n === 'number' && Number.isInteger(n) && n >= 1) {
    return n
  } else {
    return def
  }
}
export function queryBlogValidator(query: any): BlogQueryModel {
  query.searchNameTerm =
    typeof query.searchNameTerm === 'string' &&
    query.searchNameTerm.trim().length > 0
      ? query.searchNameTerm.trim()
      : null

  query.sortBy = validateSortBy(query.sortBy)
  query.sortDirection = query.sortDirection === SortDirections.asc ? 1 : -1

  query.pageNumber = validateNumber(+query.pageNumber, 1)
  query.pageSize = validateNumber(+query.pageSize, 10)

  return query
}
