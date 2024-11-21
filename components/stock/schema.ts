import { writePrice } from '@/lib/data-functions'

export const sortOptions = [
  { value: 'quantity', label: 'Quantity In Store (Low to High)' },
  { value: 'quantityRev', label: 'Quantity In Store (High to Low)' },
  { value: 'sku', label: 'SKU' },
  { value: 'artist', label: 'Artist' },
  { value: 'title', label: 'Title' },
  { value: 'format', label: 'Format' },
  // { value: 'vendorCut', label: 'Vendor Cut (Low to High)' },
  // { value: 'vendorCutRev', label: 'Vendor Cut (High to Low)' },
  { value: 'price', label: 'Cheapest Items' },
  { value: 'priceRev', label: 'Most Expensive Items' },
  // { value: 'storeCut', label: 'Store Cut (Low to High)' },
  // { value: 'storeCutRev', label: 'Store Cut (High to Low)' },
  { value: 'margin', label: 'Lowest Margin' },
  { value: 'marginRev', label: 'Highest Margin' },
  { value: 'quantitySold', label: 'Best Sellers' },
  { value: 'quantitySoldRev', label: 'Worst Sellers' },
]

export const csvSchema = [
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

export const tableSchema = [
  { width: 80, label: 'SKU', field: 'sku' },
  { width: 180, label: 'ARTIST', field: 'artist' },
  { width: 250, label: 'TITLE', field: 'title' },
  { width: 90, label: 'FORMAT', field: 'format' },
  { width: 80, label: 'CONDITION', field: 'condition' },
  { width: 64, label: 'VENDOR CUT', field: 'vendorCut', align: 'right' },
  { width: 64, label: 'TOTAL SELL', field: 'totalSell', align: 'right' },
  { width: 64, label: 'MARGIN', field: 'margin', align: 'right' },
  { width: 64, label: 'QTY IN STORE', field: 'qtyInStock', align: 'right' },
  { width: 64, label: 'QTY SOLD', field: 'qtySold', align: 'right' },
]

export const tableStock = (stock) =>
  stock?.map((item) => ({
    sku: { value: item?.sku },
    artist: { value: item?.artist },
    title: { value: item?.title },
    format: { value: item?.format },
    new: { value: item?.is_new ? 'Yes' : 'No' },
    condition: {
      value: `${item?.is_new ? 'New ' : 'Used'}${
        item?.cond ? ` [${item?.cond}]` : ''
      }`,
    },
    vendorCut: { value: writePrice(item?.vendor_cut) },
    totalSell: { value: writePrice(item?.total_sell) },
    margin: { value: item?.margin && `${item?.margin?.toFixed?.(1)}%` },
    qtyInStock: {
      value: item?.quantity < 0 ? 0 : item?.quantity,
      red: item?.quantity < 1,
    },
    qtySold: { value: item?.quantity_sold < 0 ? 0 : item?.quantity_sold },
    // For Grid only
    image_url: { value: item?.image_url },
    section: { value: item?.section },
  }))

export const filterStock = (stock, search, sortOption) =>
  stock
    ?.filter(
      (item) =>
        search === '' ||
        `${item?.artist} ${item?.title}`
          ?.toLowerCase()
          ?.includes(search?.toLowerCase())
    )
    ?.sort((a, b) => {
      switch (sortOption) {
        case 'sku':
          return a.sku?.localeCompare(b.sku) // Sort by SKU
        case 'artist':
          return a.artist?.localeCompare(b.artist) // Sort by Artist
        case 'title':
          return a.title?.localeCompare(b.title) // Sort by Title
        case 'format':
          return a.format?.localeCompare(b.format) // Sort by Format
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
        case 'quantitySoldRev':
          return a.quantity_sold - b.quantity_sold // Sort by Quantity Sold
        case 'quantitySold':
          return b.quantity_sold - a.quantity_sold // Sort by Quantity Sold (Descending)
        default:
          return 0 // No sorting if the key doesn't match any case
      }
    })
