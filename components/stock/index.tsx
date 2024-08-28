import dayjs from 'dayjs'
import StockItem from './item'
import Title from '../layout/title'
import { useEffect, useState } from 'react'
import { filterByDates } from '@/lib/data-functions'
import DatePicker from '../input/datePicker'
import Search from '../input/search'
import Select from '../input/select'
import StockTableHeader from './tableHeader'
import { downloadCsv, generateCsv } from '@/lib/csv'

export default function Stock({ stock }) {
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('2018-11-03')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [filteredStock, setFilteredStock] = useState(stock)
  const [sortOption, setSortOption] = useState('sku')

  useEffect(() => {
    const filtered = stock?.filter(
      (item) =>
        search === '' ||
        `${item?.artist} ${item?.title}`
          ?.toLowerCase()
          ?.includes(search?.toLowerCase())
    )
    setFilteredStock(
      filtered.sort((a, b) => {
        switch (sortOption) {
          case 'sku':
            return a.sku.localeCompare(b.sku) // Sort by SKU
          case 'artist':
            return a.artist.localeCompare(b.artist) // Sort by Artist
          case 'title':
            return a.title.localeCompare(b.title) // Sort by Title
          case 'format':
            return a.format.localeCompare(b.format) // Sort by Format
          case 'vendorCut':
            return a.vendor_cut - b.vendor_cut // Sort by Vendor Cut
          case 'vendorCutRev':
            return b.vendor_cut - a.vendor_cut // Sort by Vendor Cut (Descending)
          case 'price':
            return a.total_sell - b.total_sell // Sort by Total Sell
          case 'priceRev':
            return b.total_sell - a.total_sell // Sort by Total Sell (Descending)
          case 'storeCut':
            return a.store_cut - b.store_cut // Sort by Store Cut
          case 'storeCutRev':
            return b.store_cut - a.store_cut // Sort by Store Cut (Descending)
          case 'margin':
            return a.margin - b.margin // Sort by Margin
          case 'marginRev':
            return b.margin - a.margin // Sort by Margin (Descending)
          case 'quantity':
            return a.quantity - b.quantity // Sort by Quantity
          case 'quantityRev':
            return b.quantity - a.quantity // Sort by Quantity (Descending)
          case 'quantitySold':
            return a.quantity_sold - b.quantity_sold // Sort by Quantity Sold
          case 'quantitySoldRev':
            return b.quantity_sold - a.quantity_sold // Sort by Quantity Sold (Descending)
          default:
            return 0 // No sorting if the key doesn't match any case
        }
      })
    )
  }, [stock, startDate, endDate, search, sortOption])

  const sortOptions = [
    { value: 'sku', label: 'SKU' },
    { value: 'artist', label: 'Artist' },
    { value: 'title', label: 'Title' },
    { value: 'format', label: 'Format' },
    { value: 'vendorCut', label: 'Vendor Cut (Low to High)' },
    { value: 'vendorCutRev', label: 'Vendor Cut (High to Low)' },
    { value: 'price', label: 'Total Sell (Low to High)' },
    { value: 'priceRev', label: 'Total Sell (High to Low)' },
    { value: 'storeCut', label: 'Store Cut (Low to High)' },
    { value: 'storeCutRev', label: 'Store Cut (High to Low)' },
    { value: 'margin', label: 'Margin (Low to High)' },
    { value: 'marginRev', label: 'Margin (High to Low)' },
    { value: 'quantity', label: 'Quantity (Low to High)' },
    { value: 'quantityRev', label: 'Quantity (High to Low)' },
    { value: 'quantitySold', label: 'Quantity Sold (Low to High)' },
    { value: 'quantitySoldRev', label: 'Quantity Sold (High to Low)' },
  ]

  const csvSchema = [
    { header: 'SKU', field: 'sku' },
    { header: 'Artist', field: 'artist' },
    { header: 'Title', field: 'title' },
    { header: 'Format', field: 'format' },
    { header: 'New', field: 'is_new' },
    { header: 'Condition', field: 'cond' },
    { header: 'Vendor Cut (NZD)', field: 'vendor_cut', format: '$' },
    { header: 'Total Sell (NZD)', field: 'total_sell', format: '$' },
    { header: 'Store Cut (NZD)', field: 'store_cut', format: '$' },
    { header: 'Margin', field: 'margin', format: '%' },
    { header: 'Quantity', field: 'quantity' },
    { header: 'Quantity Sold', field: 'quantity_sold' },
  ]

  const csvContent = generateCsv(stock, csvSchema)

  const downloadData = () =>
    downloadCsv(csvContent, `ross-stock-${dayjs()?.format('YYYY-MM-DD')}`)

  return (
    <div className="w-full">
      <Title title={'RIDE ON SUPER SOUND STOCK'} downloadData={downloadData} />
      <div className="flex justify-between items-start space-x-8 py-2">
        <Search value={search} setValue={setSearch} label="SEARCH STOCK" />
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
      {filteredStock?.length === 0 ? (
        <div>NO STOCK FOUND</div>
      ) : (
        <div>
          <StockTableHeader />
          {filteredStock?.map((item, i) => (
            <StockItem key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
