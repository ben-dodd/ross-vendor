import { filterInventory } from '@/lib/data-functions'
import { StockObject } from '@/lib/types'
import StockItem from './item2'
import { useEffect, useState } from 'react'
import Title from '../layout/title'
import Search from '../input/search'
import { downloadCsv, generateCsv } from '@/lib/csv'
import dayjs from 'dayjs'

const Stock = ({ stock }) => {
  const initFormats = ['LP', 'CD', '7"']
  const [search, setSearch] = useState('')
  const [filteredStock, setFilteredStock] = useState(stock)
  const [sortOption, setSortOption] = useState('date')
  const [formats, setFormats] = useState(initFormats)

  useEffect(() => {
    console.log(stock)
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
          default:
            return 0 // No sorting if the key doesn't match any case
        }
      })
    )
  }, [stock, search, sortOption])

  const sortOptions = [
    { value: 'date', label: 'Newest to Oldest' },
    { value: 'dateRev', label: 'Oldest to Newest' },
    { value: 'format', label: 'Sort by Format' },
    { value: 'artist', label: 'Sort by Artist' },
    { value: 'title', label: 'Sort by Title' },
    { value: 'price', label: 'Sort by Price (Low to High)' },
    { value: 'priceRev', label: 'Sort by Price (High to Low)' },
    { value: 'vendorCut', label: 'Sort by Vendor Cut (Low to High)' },
    { value: 'vendorCutRev', label: 'Sort by Vendor Cut (High to Low)' },
  ]

  const formatOptions = initFormats.map((val) => ({ value: val, label: val }))

  const csvSchema = [
    { header: 'Sale Date', field: 'date_sale_closed', format: 'D MMMM YYYY' },
    { header: 'Format', field: 'format' },
    { header: 'Artist', field: 'artist' },
    { header: 'Title', field: 'title' },
    { header: 'Retail Price (NZD)', field: 'price', format: '$' },
    { header: 'ROSS Take (NZD)', field: 'store_cut', format: '$' },
    { header: 'Vendor Take (NZD)', field: 'vendor_cut', format: '$' },
  ]
  const csvContent = generateCsv(stock, csvSchema)

  const downloadData = () =>
    downloadCsv(csvContent, `ross-stock-${dayjs()?.format('YYYY-MM-DD')}`)

  return (
    <div className="w-full">
      <Title title={'RIDE ON SUPER SOUND STOCK'} downloadData={downloadData} />
      <div className="flex justify-between items-end space-x-8 py-2">
        <Search value={search} setValue={setSearch} label="SEARCH STOCK" />
      </div>
      {filteredStock?.map((item: StockObject) => (
        <StockItem key={item.id} item={item} />
      ))}
    </div>
  )
}

export default Stock
