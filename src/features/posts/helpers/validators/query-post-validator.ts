import { SortDirections } from '../../../../shared'
import { PostQueryModel } from '../../models/PostQueryModel'
import { SortPostFields } from '../enums/sort-post-fields'

function validateSortBy(sortBy: any): string {
  if (Object.values(SortPostFields).includes(sortBy)) {
    return sortBy
  } else {
    return SortPostFields.createdAt
  }
}

function validateNumber(n: any, def: number): number {
  if (typeof n === 'number' && Number.isInteger(n) && n >= 1) {
    return n
  } else {
    return def
  }
}
export function queryPostValidator(query: any): PostQueryModel {
  query.pageNumber = validateNumber(+query.pageNumber, 1)
  query.pageSize = validateNumber(+query.pageSize, 10)
  query.sortBy = validateSortBy(query.sortBy)
  query.sortDirection = query.sortDirection === SortDirections.asc ? 1 : -1
  query.blogId

  return query
}
