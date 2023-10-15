export type BlogQueryModel = {
  searchNameTerm?: string | null
  sortBy?: string
  sortDirection?: string | number
  pageNumber?: number
  pageSize?: number
}
