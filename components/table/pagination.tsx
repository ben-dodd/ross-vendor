import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { PaginationProps } from './types'

const Pagination = ({ pagination, setPagination }: PaginationProps) => {
  const { currentPage, totalPages } = pagination || {}

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setPagination({ ...pagination, currentPage: currentPage - 1 })
    }
  }

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setPagination({ ...pagination, currentPage: currentPage + 1 })
    }
  }

  const handlePageSelect = (event) => {
    setPagination({ ...pagination, currentPage: Number(event.target.value) })
  }

  const handleRowsPerPageChange = (event) => {
    setPagination({
      ...pagination,
      currentPage: 1,
      rowsPerPage:
        event.target.value === 'all' ? 'all' : Number(event.target.value),
    })
  }

  return (
    <div className="flex justify-between items-center py-2 px-4 bg-black text-white text-xs mb-1">
      <button
        onClick={handlePreviousClick}
        disabled={currentPage === 1}
        className="flex items-center hover:text-orange-200 disabled:opacity-50 disabled:text-white"
      >
        <IconArrowLeft size={18} className="mr-1" />
        Previous
      </button>

      <div className="flex items-center">
        <span>Page </span>
        <select
          value={currentPage}
          onChange={handlePageSelect}
          className="mx-2 bg-black text-white border border-white rounded"
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <span> of {totalPages}</span>
      </div>

      <div className="flex items-center">
        <span>Show </span>
        <select
          value={
            pagination.rowsPerPage === pagination.totalRows
              ? 'all'
              : pagination.rowsPerPage
          }
          onChange={handleRowsPerPageChange}
          className="mx-2 bg-black text-white border border-white rounded"
        >
          {[10, 20, 50, 100, 200, 'all'].map((size, index) => (
            <option key={index} value={size}>
              {size === 'all' ? 'All' : size}
            </option>
          ))}
        </select>
        <span> rows</span>
      </div>

      <button
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        className="flex items-center hover:text-orange-200 disabled:opacity-50 disabled:text-white"
      >
        Next
        <IconArrowRight size={18} className="ml-1" />
      </button>
    </div>
  )
}

export default Pagination
