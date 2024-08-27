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

export function summarisePaymentsData(
  payments: PaymentData[]
): PaymentMonthlySummary[] {
  // Create a map to hold the monthly summary data
  const summary: Record<
    string,
    { totalPayments: number; totalAmount: number }
  > = {}

  payments.forEach((payment) => {
    const month = dayjs(payment.date).format('YYYY-MM') // Extract year-month from date

    if (!summary[month]) {
      summary[month] = {
        totalPayments: 0,
        totalAmount: 0,
      }
    }

    summary[month].totalPayments += 1
    summary[month].totalAmount += payment.amount / 100
  })

  // Convert the summary object to an array and sort it by month
  const sortedSummary = Object.entries(summary)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => (dayjs(a.month).isBefore(dayjs(b.month)) ? -1 : 1))

  return sortedSummary
}

export function summariseSalesData(
  salesData: SaleData[]
): SaleMonthlySummary[] {
  const summary: Record<string, SaleMonthlySummary> = {}

  salesData.forEach((sale) => {
    const month = dayjs(sale.date_sale_closed).format('YYYY-MM')

    if (!summary[month]) {
      summary[month] = {
        month,
        totalQuantities: 0,
        formatDetails: {},
        totalStoreCut: 0,
        totalTotalSell: 0,
        totalVendorCut: 0,
      }
    }

    const monthSummary = summary[month]

    // Increment totals
    monthSummary.totalQuantities += sale.quantity
    monthSummary.totalStoreCut += sale.store_cut / 100
    monthSummary.totalTotalSell += sale.total_sell / 100
    monthSummary.totalVendorCut += sale.vendor_cut / 100

    // Initialize format details if not already present
    if (!monthSummary.formatDetails[sale.format]) {
      monthSummary.formatDetails[sale.format] = {
        totalQuantity: 0,
        totalSell: 0,
        totalStoreCut: 0,
        totalVendorCut: 0,
      }
    }

    // Update format details
    const formatSummary = monthSummary.formatDetails[sale.format]
    formatSummary.totalQuantity += sale.quantity
    formatSummary.totalSell += sale.total_sell / 100
    formatSummary.totalStoreCut += sale.store_cut / 100
    formatSummary.totalVendorCut += sale.vendor_cut / 100
  })

  // Convert the summary object to an array and sort it by month
  const sortedSummary: SaleMonthlySummary[] = Object.values(summary).sort(
    (a, b) => (dayjs(a.month).isBefore(dayjs(b.month)) ? -1 : 1)
  )

  return sortedSummary
}

// Helper function to generate random colors for each format
export function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
