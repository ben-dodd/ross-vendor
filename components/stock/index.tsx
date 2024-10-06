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
import Grid from './grid'

export default function Stock({ stock }) {
  const [view, setView] = useState('table')
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('2018-11-03')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [filteredStock, setFilteredStock] = useState(stock)
  const [sortOption, setSortOption] = useState('quantity')
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    rowsPerPage: 50,
    totalRows: null,
    totalPages: null,
  })

  const toggleView = () =>
    setView((view) => (view === 'table' ? 'grid' : 'table'))

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
      {/* <Title title={'RIDE ON SUPER SOUND STOCK'} downloadData={downloadData} /> */}
      <div className="flex justify-between items-center bg-orange-800 text-white font-bold italic px-2 py-1 mb-2">
        <div className="md:hidden" />
        <div className="hidden md:block">RIDE ON SUPER SOUND STOCK</div>
        <div className="flex">
          <div
            onClick={toggleView}
            className={`hidden md:block uppercase px-4 py-1 mr-2 cursor-pointer italic text-orange-600 hover:text-orange-300 bg-white font-black text-sm`}
          >
            {`SWITCH TO ${view === 'table' ? 'GRID' : 'TABLE'} VIEW`}
          </div>
          <div
            onClick={downloadData}
            className={`uppercase px-4 py-1 cursor-pointer italic text-orange-600 hover:text-orange-300 bg-white font-black text-sm`}
          >
            DOWNLOAD DATA
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center py-2 md:flex-row md:justify-between md:items-start">
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
      <div className="hidden md:block">
        {view === 'table' ? (
          <Table
            data={tableData}
            schema={tableSchema}
            pagination={pagination}
            setPagination={setPagination}
          />
        ) : (
          <Grid
            data={tableData}
            pagination={pagination}
            setPagination={setPagination}
          />
        )}
      </div>
      <div className="block md:hidden">
        <Grid
          data={tableData}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  )
}
