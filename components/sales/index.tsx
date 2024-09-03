import dayjs from 'dayjs'
import SalesItem from './item'
import Title from '../layout/title'
import { useEffect, useMemo, useState } from 'react'
import { filterByDates, writePrice } from '@/lib/data-functions'
import DatePicker from '../input/datePicker'
import Search from '../input/search'
import Select from '../input/select'
import SalesTableHeader from './tableHeader'
import { downloadCsv, generateCsv } from '@/lib/csv'
import Selector from '../input/select'
import Table from '../table'

export default function Sales({ sales }) {
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('2018-11-03')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [filteredSales, setFilteredSales] = useState(sales)
  const [sortOption, setSortOption] = useState('date')
  const [pagination, setPagination] = useState({ page: 1, numRows: 20 })

  useEffect(() => {
    const filtered = filterByDates(
      sales,
      startDate,
      endDate,
      'date_sale_closed'
    )?.filter(
      (sale) =>
        search === '' ||
        `${sale?.artist} ${sale?.title}`
          ?.toLowerCase()
          ?.includes(search?.toLowerCase())
    )
    setFilteredSales(
      filtered.sort((a, b) => {
        switch (sortOption) {
          case 'dateRev':
            return dayjs(a.date_sale_closed).diff(dayjs(b.date_sale_closed)) // Oldest to Newest
          // case 'qty':
          //   return a.quantity - b.quantity
          // case 'qtyRev':
          //   return b.quantity - a.quantity
          case 'format':
            return a.format.localeCompare(b.format) // Sort by Format
          case 'artist':
            return a.artist.localeCompare(b.artist) // Sort by Artist
          case 'title':
            return a.title.localeCompare(b.title) // Sort by Title
          case 'price':
            return a.total_sell - b.total_sell // Sort by Price (assuming total_sell is the price)
          case 'priceRev':
            return b.total_sell - a.total_sell // Sort by Price (assuming total_sell is the price)
          case 'vendorCut':
            return a.vendor_cut - b.vendor_cut // Sort by vendorCut (assuming vendor_cut is the vendorCut)
          case 'vendorCutRev':
            return b.vendor_cut - a.vendor_cut // Sort by Price (assuming vendor_cut is the price)
          case 'margin':
            return a.margin - b.margin // Sort by margin
          case 'marginRev':
            return b.margin - a.margin // Sort by margin
          default:
            return 0 // No sorting if the key doesn't match any case
        }
      })
    )
  }, [sales, startDate, endDate, search, sortOption])

  const sortOptions = [
    { value: 'date', label: 'Date (Newest to Oldest)' },
    { value: 'dateRev', label: 'Date (Oldest to Newest)' },
    { value: 'format', label: 'Format' },
    { value: 'artist', label: 'Artist' },
    { value: 'title', label: 'Title' },
    { value: 'price', label: 'Price (Low to High)' },
    { value: 'priceRev', label: 'Price (High to Low)' },
    { value: 'vendorCut', label: 'Vendor Cut (Low to High)' },
    { value: 'vendorCutRev', label: 'Vendor Cut (High to Low)' },
    { value: 'margin', label: 'Margin (Low to High)' },
    { value: 'marginRev', label: 'Margin (High to Low)' },
  ]

  const csvSchema = [
    { header: 'Sale Date', field: 'date_sale_closed', format: 'D MMMM YYYY' },
    { header: 'Format', field: 'format' },
    { header: 'Artist', field: 'artist' },
    { header: 'Title', field: 'title' },
    { header: 'Retail Price (NZD)', field: 'price', format: '$' },
    { header: 'ROSS Take (NZD)', field: 'store_cut', format: '$' },
    { header: 'Vendor Take (NZD)', field: 'vendor_cut', format: '$' },
    { header: 'Margin', field: 'margin', format: '%' },
  ]
  const csvContent = generateCsv(sales, csvSchema)

  const tableSchema = [
    { width: 3, label: 'DATE SOLD', field: 'date' },
    { width: 1, label: 'STOCK REMAINING', field: 'stockRemaining' },
    { width: 1, label: 'FORMAT', field: 'format' },
    { width: 2, label: 'ARTIST', field: 'artist' },
    { width: 2, label: 'TITLE', field: 'title' },
    { width: 2, label: 'RETAIL PRICE', align: 'right', field: 'retailPrice' },
    { width: 1, label: 'ROSS TAKE', align: 'right', field: 'rossTake' },
    { width: 1, label: 'VENDOR TAKE', align: 'right', field: 'vendorTake' },
    { width: 1, label: 'MARGIN', align: 'right', field: 'margin' },
  ]

  const tableData = useMemo(
    () =>
      filteredSales?.map((sale) => ({
        date: { value: dayjs(sale?.date_sale_closed).format('DD/MM/YY') },
        stockRemaining: { value: sale?.quantity },
        format: { value: sale?.format },
        artist: { value: sale?.artist },
        title: {
          value: `${sale?.title}${sale?.is_refunded ? ' [REFUNDED]' : ''}`,
        },
        retailPrice: {
          value: writePrice(sale?.total_sell),
          line: sale?.is_refunded,
        },
        rossTake: {
          value: writePrice(sale?.store_cut),
          line: sale?.is_refunded,
        },
        vendorTake: {
          value: writePrice(sale?.vendor_cut),
          line: sale?.is_refunded,
        },
        margin: { value: `${sale?.margin?.toFixed?.(1)}%` },
      })),
    [filteredSales]
  )

  const downloadData = () =>
    downloadCsv(csvContent, `ross-sales-${dayjs()?.format('YYYY-MM-DD')}`)
  return (
    <div className="w-full">
      <Title title={'RIDE ON SUPER SOUND SALES'} downloadData={downloadData} />
      <div className="flex justify-between items-start space-x-8 py-2">
        <Search value={search} setValue={setSearch} label="SEARCH SALES" />
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
      {filteredSales?.length === 0 ? (
        <div>NO SALES FOUND</div>
      ) : (
        <Table
          data={tableData}
          schema={tableSchema}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </div>
  )
}
