import Title from '../layout/title'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { downloadCsv, generateCsv } from '@/lib/csv'
import Search from '../input/search'
import DatePicker from '../input/datePicker'
import Select from '../input/select'
import {
  csvSchema,
  filterPayments,
  sortOptions,
  tablePayments,
  tableSchema,
} from './schema'
import Table from '../table'
import { PaginationState } from '../table/types'
import PaymentsGrid from './grid'
import SaleSummary from '../saleSummary'

export default function Payments({ payments }) {
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('2018-11-03')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [filteredPayments, setFilteredPayments] = useState(payments)
  const [sortOption, setSortOption] = useState('date')
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    rowsPerPage: 50,
    totalRows: null,
    totalPages: null,
  })

  useEffect(
    () =>
      setPagination((prev) => ({
        ...prev,
        totalRows: filteredPayments?.length,
        totalPages:
          pagination?.rowsPerPage === 'all'
            ? 1
            : Math.ceil(filteredPayments?.length / pagination?.rowsPerPage),
      })),
    [pagination?.rowsPerPage, filteredPayments?.length]
  )
  const rowsPerPageNumber =
    typeof pagination.rowsPerPage === 'number'
      ? pagination.rowsPerPage
      : filteredPayments.length
  const startIndex = (pagination?.currentPage - 1) * rowsPerPageNumber
  const endIndex = startIndex + rowsPerPageNumber
  const paginatedData = filteredPayments.slice(startIndex, endIndex)

  const resetPagination = () =>
    setPagination((prev) => ({ ...prev, currentPage: 1 }))

  const handleSetSearch = (val) => {
    setSearch(val)
    resetPagination()
  }

  useEffect(() => {
    setFilteredPayments(
      filterPayments(payments, startDate, endDate, search, sortOption)
    )
  }, [payments, startDate, endDate, search, sortOption])

  const tableData = useMemo(() => tablePayments(paginatedData), [paginatedData])

  const csvContent = generateCsv(payments, csvSchema)
  const downloadData = () =>
    downloadCsv(csvContent, `ross-payments-${dayjs()?.format('YYYY-MM-DD')}`)

  return (
    <div className="w-full">
      <Title
        title={'RIDE ON SUPER SOUND PAYMENTS'}
        downloadData={downloadData}
      />
      <div className="flex flex-col items-center py-2 md:flex-row md:justify-between md:items-start">
        <Search
          value={search}
          setValue={handleSetSearch}
          label="SEARCH PAYMENTS"
        />
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <Select
          label="SORT BY"
          options={sortOptions}
          value={null}
          onChange={(val) => setSortOption(val)}
        />
      </div>
      <div className="hidden md:block">
        <Table
          data={tableData}
          schema={tableSchema}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
      <div className="block md:hidden">
        <PaymentsGrid
          data={tableData}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  )
}
