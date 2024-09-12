import dayjs from 'dayjs'
import Title from '../layout/title'
import { useEffect, useMemo, useState } from 'react'
import DatePicker from '../input/datePicker'
import Search from '../input/search'
import Select from '../input/select'
import { downloadCsv, generateCsv } from '@/lib/csv'
import Table from '../table'
import {
  csvSchema,
  filterSales,
  sortOptions,
  tableSales,
  tableSchema,
} from './schema'
import { PaginationState } from '../table/types'
import SalesGrid from './grid'

export default function Sales({ sales }) {
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('2018-11-03')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [filteredSales, setFilteredSales] = useState(sales)
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
        totalRows: filteredSales?.length,
        totalPages:
          pagination?.rowsPerPage === 'all'
            ? 1
            : Math.ceil(filteredSales?.length / pagination?.rowsPerPage),
      })),
    [pagination?.rowsPerPage, filteredSales?.length]
  )
  const rowsPerPageNumber =
    typeof pagination.rowsPerPage === 'number'
      ? pagination.rowsPerPage
      : filteredSales.length
  const startIndex = (pagination?.currentPage - 1) * rowsPerPageNumber
  const endIndex = startIndex + rowsPerPageNumber
  const paginatedData = filteredSales.slice(startIndex, endIndex)

  const resetPagination = () =>
    setPagination((prev) => ({ ...prev, currentPage: 1 }))

  const handleSetSearch = (val) => {
    setSearch(val)
    resetPagination()
  }

  useEffect(() => {
    setFilteredSales(filterSales(sales, startDate, endDate, search, sortOption))
  }, [sales, startDate, endDate, search, sortOption])

  const tableData = useMemo(() => tableSales(paginatedData), [paginatedData])

  const csvContent = generateCsv(sales, csvSchema)
  const downloadData = () =>
    downloadCsv(csvContent, `ross-sales-${dayjs()?.format('YYYY-MM-DD')}`)

  return (
    <div className="w-full">
      <Title title={'RIDE ON SUPER SOUND SALES'} downloadData={downloadData} />
      <div className="flex flex-col items-center py-2 md:flex-row md:justify-between md:items-start">
        <Search
          value={search}
          setValue={handleSetSearch}
          label="SEARCH SALES"
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
          onChange={(val) => {
            setSortOption(val)
            resetPagination()
          }}
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
        <SalesGrid
          data={tableData}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  )
}
