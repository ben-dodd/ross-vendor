export interface PaginationProps {
  pagination: PaginationState
  setPagination: any
}

export interface PaginationState {
  currentPage: number
  rowsPerPage: number | 'all'
  totalRows: number | null
  totalPages: number | null
}
