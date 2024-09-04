import dayjs from 'dayjs'
import Title from '../layout/title'
import { useEffect, useMemo, useState } from 'react'
import DatePicker from '../input/datePicker'
import Search from '../input/search'
import Select from '../input/select'
import { downloadCsv, generateCsv } from '@/lib/csv'
import {
  csvSchema,
  filterStock,
  sortOptions,
  tableSchema,
  tableStock,
} from './schema'
import Table from '../table'
import { PaginationState } from '../table/types'

export default function Stock({ stock }) {
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('2018-11-03')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [filteredStock, setFilteredStock] = useState(stock)
  const [sortOption, setSortOption] = useState('sku')
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    rowsPerPage: 10,
    totalRows: null,
    totalPages: null,
  })

  useEffect(
    () =>
      setPagination((prev) => ({
        ...prev,
        totalRows: filteredStock?.length,
        totalPages:
          pagination?.rowsPerPage === 'all'
            ? 1
            : Math.ceil(filteredStock?.length / pagination?.rowsPerPage),
      })),
    [pagination?.rowsPerPage, filteredStock?.length]
  )
  const rowsPerPageNumber =
    typeof pagination.rowsPerPage === 'number'
      ? pagination.rowsPerPage
      : filteredStock.length
  const startIndex = (pagination?.currentPage - 1) * rowsPerPageNumber
  const endIndex = startIndex + rowsPerPageNumber
  const paginatedData = filteredStock.slice(startIndex, endIndex)

  const resetPagination = () =>
    setPagination((prev) => ({ ...prev, currentPage: 1 }))

  const handleSetSearch = (val) => {
    setSearch(val)
    resetPagination()
  }

  useEffect(() => {
    setFilteredStock(filterStock(stock, search, sortOption))
  }, [stock, search, sortOption])

  const tableData = useMemo(() => tableStock(paginatedData), [paginatedData])

  const csvContent = generateCsv(stock, csvSchema)
  const downloadData = () =>
    downloadCsv(csvContent, `ross-stock-${dayjs()?.format('YYYY-MM-DD')}`)

  return (
    <div className="w-full">
      <Title title={'RIDE ON SUPER SOUND STOCK'} downloadData={downloadData} />
      <div className="flex justify-between items-start space-x-8 py-2">
        <Search
          value={search}
          setValue={handleSetSearch}
          label="SEARCH STOCK"
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
      <Table
        data={tableData}
        schema={tableSchema}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  )
}
