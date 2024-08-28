import {
  PaymentData,
  PaymentMonthlySummary,
  SaleData,
  SaleMonthlySummary,
  StockObject,
} from '@/lib/types'

import dayjs from 'dayjs'

export function getItemSku(item: StockObject) {
  return `${('000' + item?.vendor_id || '').slice(-3)}/${(
    '00000' + item?.id || ''
  ).slice(-5)}`
}

export function getImageSrc(item: StockObject) {
  let src = 'default'
  if (item?.image_url) return item.image_url
  if (item?.is_gift_card) src = 'giftCard'
  if (item?.format === 'Zine') src = 'zine'
  else if (item?.format === 'Comics') src = 'comic'
  else if (item?.format === 'Book') src = 'book'
  else if (item?.format === '7"') src = '7inch'
  else if (item?.format === '10"') src = '10inch'
  else if (item?.format === 'LP') src = 'LP'
  else if (item?.format === 'CD') src = 'CD'
  else if (item?.format === 'Cassette') src = 'cassette'
  else if (item?.format === 'Badge') src = 'badge'
  else if (item?.format === 'Shirt') src = 'shirt'
  return `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/${src}.png`
}

export function filterInventory({
  inventory,
  search,
  slice = 50,
  emptyReturn = false,
}) {
  if (!inventory) return []
  return inventory
    ?.filter((item: StockObject) => {
      let res = true
      if (!search || search === '') return emptyReturn

      if (search) {
        let terms = search.split(' ')
        let itemMatch = `
        ${getItemSku(item) || ''}
        ${item?.artist || ''}
        ${item?.title || ''}
        ${item?.format || ''}
        ${item?.genre || ''}
        ${item?.country || ''}
        ${item?.section || ''}
        ${item?.tags ? item?.tags?.join(' ') : ''}
        ${item?.vendor_name || ''}
        ${item?.googleBooksItem?.volumeInfo?.authors?.join(' ') || ''}
        ${item?.googleBooksItem?.volumeInfo?.publisher || ''}
        ${item?.googleBooksItem?.volumeInfo?.subtitle || ''}
        ${item?.googleBooksItem?.volumeInfo?.categories?.join(' ') || ''}
      `
        terms.forEach((term: string) => {
          if (!itemMatch.toLowerCase().includes(term.toLowerCase())) res = false
        })
      }

      return res
    })
    .slice(0, slice)
}

export function sumPrices(
  saleItems: any[],
  inventory: StockObject[],
  field: string
) {
  if (!saleItems) return 0
  return saleItems
    ?.filter((s) => !s?.is_refunded)
    ?.reduce((acc, saleItem) => {
      // Dont bother getting inventory item if not needed
      let item: StockObject =
        saleItem?.total_sell && saleItem?.vendor_cut && saleItem?.store_cut
          ? null
          : inventory?.filter(
              (i: StockObject) => i?.id === saleItem?.item_id
            )?.[0]
      const prices = getCartItemPrice(saleItem, item)
      return (acc += prices?.[field])
    }, 0)
}
export function writePrice(cents, omitDollarSign = false) {
  const parsedCents = typeof cents === 'string' ? parseFloat(cents) : cents
  if (isNaN(parsedCents) || parsedCents === null || parsedCents === undefined) {
    return ''
  }
  return `${omitDollarSign ? '' : '$'}${(parsedCents / 100).toFixed(2)}`
}

export function getCartItemPrice(cartItem: any, item: StockObject) {
  // Gets three prices for each sale item: the vendor cut, store cut, and total
  // Price is returned in cents
  const totalSell: number = !cartItem
    ? 0
    : item?.is_gift_card
    ? item?.gift_card_amount || 0
    : item?.is_misc_item
    ? item?.misc_item_amount || 0
    : null
  const vendorCut: number = cartItem?.vendor_cut ?? item?.vendor_cut
  const storeCut: number = item?.is_misc_item
    ? item?.misc_item_amount || 0
    : // : cartItem?.store_cut ??
      (cartItem?.total_sell ?? item?.total_sell) - vendorCut
  const storePrice: number = getPrice(
    storeCut,
    cartItem?.store_discount,
    cartItem?.quantity
  )
  const vendorPrice: number = getPrice(
    vendorCut,
    cartItem?.vendor_discount,
    cartItem?.quantity
  )
  const totalPrice: number = totalSell ?? storePrice + vendorPrice
  return { storePrice, vendorPrice, totalPrice }
}

export function getPrice(
  cost: number | string,
  discount: number | string,
  quantity: number | string
) {
  return (
    (parseInt(`${quantity}`) ?? 1) *
    ((parseFloat(`${cost}`) || 0) *
      (1 - (parseFloat(`${discount}`) || 0) / 100))
  )
}

export function filterByDates(
  data: any[],
  startDate: string,
  endDate: string,
  dateField: string = 'date'
) {
  return data?.filter((item) =>
    dayjs(item?.[dateField])?.isBetween(
      dayjs(startDate),
      dayjs(endDate),
      null,
      '[]'
    )
  )
}

// Payment summary function with month processing
export const summarisePaymentData = (
  paymentData: PaymentData[]
): PaymentMonthlySummary[] => {
  // Get min and max dates from the payment data
  const minDate = dayjs.min(paymentData.map((payment) => dayjs(payment.date)))
  const maxDate = dayjs() // Use today's date

  // Get all months from the earliest payment date to today
  const allMonths = getAllMonths(minDate, maxDate)

  // Initialize summary object with all months
  const summary: Record<string, PaymentMonthlySummary> = {}
  allMonths.forEach((month) => {
    summary[month] = {
      month: month,
      totalPayments: 0,
      totalAmount: 0,
    }
  })

  // Process each payment
  paymentData.forEach((payment) => {
    const month = dayjs(payment.date).format('YYYY-MM')
    summary[month].totalPayments += 1
    summary[month].totalAmount += payment.amount
  })

  return Object.values(summary)
}

// Helper function to get all months between two dates
const getAllMonths = (
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
): string[] => {
  const start = dayjs(startDate).startOf('month')
  const end = dayjs(endDate).endOf('month')
  const months: string[] = []

  let current = start
  while (current.isBefore(end) || current.isSame(end, 'month')) {
    months.push(current.format('YYYY-MM'))
    current = current.add(1, 'month')
  }

  return months
}
// Sales summary function with month processing and format categorisation
export const summariseSalesData = (
  salesData: SaleData[]
): SaleMonthlySummary[] => {
  // Get min and max dates from the sales data
  const minDate = dayjs.min(
    salesData.map((sale) => dayjs(sale.date_sale_closed))
  )
  const maxDate = dayjs() // Use today's date

  // Get all months from the earliest sale date to today
  const allMonths = getAllMonths(minDate, maxDate)

  // Initialize summary object with all months
  const summary: Record<string, SaleMonthlySummary> = {}
  allMonths.forEach((month) => {
    summary[month] = {
      month: month,
      totalQuantities: 0,
      formatDetails: {},
      totalStoreCut: 0,
      totalTotalSell: 0,
      totalVendorCut: 0,
    }
  })

  // Process each sale
  salesData.forEach((sale) => {
    const month = dayjs(sale.date_sale_closed).format('YYYY-MM')
    const format = sale.format
    const vendorCut = sale.vendor_cut / 100 // Convert to dollars
    const storeCut = sale.store_cut / 100 // Convert to dollars
    const totalSell = sale.total_sell / 100 // Convert to dollars
    const quantity = sale.quantity

    // Update month summary
    if (!summary[month].formatDetails[format]) {
      summary[month].formatDetails[format] = {
        totalQuantity: 0,
        totalSell: 0,
        totalStoreCut: 0,
        totalVendorCut: 0,
      }
    }

    summary[month].formatDetails[format].totalQuantity += quantity
    summary[month].formatDetails[format].totalSell += totalSell
    summary[month].formatDetails[format].totalStoreCut += storeCut
    summary[month].formatDetails[format].totalVendorCut += vendorCut

    summary[month].totalQuantities += quantity
    summary[month].totalStoreCut += storeCut
    summary[month].totalTotalSell += totalSell
    summary[month].totalVendorCut += vendorCut
  })

  // Collect all formats and their totals
  const formatTotals: Record<string, { totalQuantity: number }> = {}

  Object.values(summary).forEach((monthData) => {
    Object.entries(monthData.formatDetails).forEach(([format, data]) => {
      if (!formatTotals[format]) {
        formatTotals[format] = { totalQuantity: 0 }
      }
      formatTotals[format].totalQuantity += data.totalQuantity
    })
  })

  // Determine top 5 formats overall
  const topFormats = Object.entries(formatTotals)
    .sort((a, b) => b[1].totalQuantity - a[1].totalQuantity)
    .slice(0, 5)
    .map(([format]) => format)

  // Update summaries to include only top 5 formats and an "Other" category
  Object.values(summary).forEach((monthData) => {
    const updatedFormatDetails: Record<string, any> = {}
    const otherSummary = {
      totalQuantity: 0,
      totalSell: 0,
      totalStoreCut: 0,
      totalVendorCut: 0,
    }

    Object.entries(monthData.formatDetails).forEach(([format, data]) => {
      if (topFormats.includes(format)) {
        updatedFormatDetails[format] = data
      } else {
        otherSummary.totalQuantity += data.totalQuantity
        otherSummary.totalSell += data.totalSell
        otherSummary.totalStoreCut += data.totalStoreCut
        otherSummary.totalVendorCut += data.totalVendorCut
      }
    })

    if (otherSummary.totalQuantity > 0) {
      updatedFormatDetails['Other'] = otherSummary
    }

    monthData.formatDetails = updatedFormatDetails
  })

  return Object.values(summary)
}
