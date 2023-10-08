import { BlogQueryModel } from '../../../models'
import { SortBlogFields } from '../../enums/sort-blog-fields'
import { SortDirections } from '../../enums/sort-directions'

function validateSortBy(sortBy: any): string {
  if (Object.values(SortBlogFields).includes(sortBy as SortBlogFields)) {
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
  let searchNameTerm = query.searchNameTerm ?? null
  let sortBy = query.sortBy ?? 'createdAt'
  let sortDirection = query.sortDirection ?? 'desc'
  const pageNumber = validateNumber(+query.pageNumber, 1)
  const pageSize = validateNumber(+query.pageSize, 10)

  searchNameTerm =
    typeof query.searchNameTerm === 'string' &&
    query.searchNameTerm.trim().length > 0
      ? query.searchNameTerm.trim()
      : null

  sortBy = validateSortBy(query.sortBy)

  sortDirection = query.sortDirection === SortDirections.asc ? 1 : -1

  return {
    searchNameTerm,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
  }
}
