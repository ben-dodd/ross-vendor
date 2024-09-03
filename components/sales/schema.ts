import { filterByDates, writePrice } from '@/lib/data-functions'
import dayjs from 'dayjs'

export const csvSchema = [
  { header: 'Sale Date', field: 'date_sale_closed', format: 'D MMMM YYYY' },
  { header: 'Format', field: 'format' },
  { header: 'Artist', field: 'artist' },
  { header: 'Title', field: 'title' },
  { header: 'Retail Price (NZD)', field: 'price', format: '$' },
  { header: 'ROSS Take (NZD)', field: 'store_cut', format: '$' },
  { header: 'Vendor Take (NZD)', field: 'vendor_cut', format: '$' },
  { header: 'Margin', field: 'margin', format: '%' },
]

export const sortOptions = [
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

export const tableSchema = [
  { width: 1, label: 'DATE SOLD', field: 'date' },
  { width: 1, label: 'QTY SOLD', field: 'qtySold' },
  { width: 1, label: 'FORMAT', field: 'format' },
  { width: 2, label: 'ARTIST', field: 'artist' },
  { width: 3, label: 'TITLE', field: 'title' },
  { width: 1, label: 'RETAIL PRICE', align: 'right', field: 'retailPrice' },
  { width: 1, label: 'ROSS TAKE', align: 'right', field: 'rossTake' },
  { width: 1, label: 'VENDOR TAKE', align: 'right', field: 'vendorTake' },
  { width: 1, label: 'MARGIN', align: 'right', field: 'margin' },
]

export const tableSales = (sales) =>
  sales?.map((sale) => ({
    date: { value: dayjs(sale?.date_sale_closed).format('DD/MM/YY') },
    qtySold: { value: sale?.quantity },
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
    margin: { value: sale?.margin && `${sale?.margin?.toFixed?.(1)}%` },
  }))

export const filterSales = (sales, startDate, endDate, search, sortOption) => {
  return filterByDates(sales, startDate, endDate, 'date_sale_closed')
    ?.filter(
      (sale) =>
        search === '' ||
        `${sale?.artist} ${sale?.title}`
          ?.toLowerCase()
          ?.includes(search?.toLowerCase())
    )
    ?.sort((a, b) => {
      switch (sortOption) {
        case 'dateRev':
          return dayjs(a.date_sale_closed).diff(dayjs(b.date_sale_closed)) // Oldest to Newest
        // case 'qty':
        //   return a.quantity - b.quantity
        // case 'qtyRev':
        //   return b.quantity - a.quantity
        case 'format':
          return a.format?.localeCompare(b.format) // Sort by Format
        case 'artist':
          return a.artist?.localeCompare(b.artist) // Sort by Artist
        case 'title':
          return a.title?.localeCompare(b.title) // Sort by Title
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
}
