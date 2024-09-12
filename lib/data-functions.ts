import {
  OutOfStockItem,
  PaymentData,
  PaymentMonthlySummary,
  SaleData,
  SaleMonthlySummary,
  StockData,
  StockObject,
  TopSeller,
} from '@/lib/types'

import dayjs from 'dayjs'
import stringSimilarity from 'string-similarity'

export function getItemSku(item: StockObject) {
  return `${('000' + item?.vendor_id || '').slice(-3)}/${(
    '00000' + item?.id || ''
  ).slice(-5)}`
}

export function getItemDisplayName(item: StockObject) {
  if (item?.display_as) return item?.display_as
  if (!item || !(item?.artist || item?.title)) return 'Untitled'
  if (item?.media === 'Clothing/Accessories')
    return getClothingDisplayName(item)
  return `${item?.title || ''}${item?.title && item?.artist ? ' - ' : ''}${
    item?.artist || ''
  }`
}

export function getClothingDisplayName(item: StockObject) {
  // M - Reaper Crew Sweatshirt (Petrol Blue)
  return `${item?.size ? `${item?.size} - ` : ''}${
    item?.title ? `${item?.title}` : ''
  }${item?.colour ? ` (${item?.colour})` : ''}`
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
export function writePrice(
  cents: number | string,
  omitDollarSign = false
): string {
  const parsedCents = typeof cents === 'string' ? parseFloat(cents) : cents
  if (isNaN(parsedCents) || parsedCents === null || parsedCents === undefined) {
    return ''
  }

  const negative = parsedCents < 0
  const absoluteValue = Math.abs(parsedCents) / 100

  // Format the number with commas and two decimal places
  const formattedValue = absoluteValue.toLocaleString('en-NZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return `${negative ? '-' : ''}${omitDollarSign ? '' : '$'}${formattedValue}`
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

export const getLatestSells = (
  salesData: SaleData[],
  limit: number
): SaleData[] => {
  return salesData
    .sort(
      (a, b) =>
        dayjs(b.date_sale_closed).unix() - dayjs(a.date_sale_closed).unix()
    )
    .slice(0, limit)
}

export const getTopSellers = (
  salesData: SaleData[],
  limit: number
): TopSeller[] => {
  const itemQuantities: Record<number, number> = {}

  salesData.forEach((sale) => {
    if (!itemQuantities[sale.item_id]) {
      itemQuantities[sale.item_id] = 0
    }
    itemQuantities[sale.item_id] += sale.quantity
  })

  return Object.entries(itemQuantities)
    .map(([itemId, quantity]) => ({
      itemId: parseInt(itemId, 10),
      quantity,
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
}

export const getOutOfStockItems = (
  salesData: SaleData[],
  stockData: StockData[]
): Record<number, OutOfStockItem> => {
  const stockMap = new Map<number, number>()

  // Map stock quantities by item ID
  stockData.forEach((stock) => {
    stockMap.set(stock.id, stock.quantity)
  })

  // Check stock status for each item in sales data
  const outOfStockItems: Record<number, OutOfStockItem> = {}

  salesData.forEach((sale) => {
    if (stockMap.has(sale.item_id)) {
      const remainingStock = stockMap.get(sale.item_id)! - sale.quantity
      if (remainingStock <= 0) {
        outOfStockItems[sale.item_id] = {
          itemId: sale.item_id,
          quantity: Math.abs(remainingStock),
        }
        stockMap.set(sale.item_id, 0) // Set stock to 0 to prevent recounting
      } else {
        stockMap.set(sale.item_id, remainingStock)
      }
    }
  })

  return outOfStockItems
}
// Helper function to normalize strings for comparison
const normaliseString = (str: string) => {
  return str
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(',', '')
}

// Function to check if a title contains a number, indicating it's part of a series or volume
const hasNumberInTitle = (title: string) => {
  return /\b\d+\b/.test(title)
}

// Function to extract a normalized version of the title without its numerical part for comparison
const normaliseTitleForComparison = (title: string) => {
  return title.replace(/\b\d+\b/, '').trim()
}

// Function to extract the design part of the title, assuming the format "SIZE - Design (Colour)"
const extractDesign = (title: string) => {
  const parts = title.split(' - ')
  if (parts.length > 1) {
    const designPart = parts[1].trim()
    // Normalize the colors inside parentheses to treat "Black on White" same as "White on Black"
    const colorMatch = designPart.match(/\(([^)]+)\)$/)
    if (colorMatch) {
      const colors = colorMatch[1]
        .split(' on ')
        .map((color) => color.trim().toLowerCase())
        .sort() // Sort alphabetically to normalize
        .join(' on ')
      return designPart.replace(/\([^)]+\)$/, `(${colors})`).trim()
    }
    return designPart
  }
  return title.trim()
}

// Function to group similar stock items with enhanced title consideration
export const groupSimilarStockItems = (stockItems: StockData[]) => {
  const groups: { [key: string]: StockData[] } = {}

  stockItems.forEach((item) => {
    const normalizedArtist = normaliseString(item.artist)
    const normalizedTitle = normaliseString(item.title)

    // Determine if the item is a clothing item based on its title format
    const isClothingItem = item?.format?.toLowerCase() === 'clothing'
    const design = isClothingItem ? extractDesign(normalizedTitle) : ''

    const hasNumber = hasNumberInTitle(normalizedTitle)
    const baseTitle = hasNumber
      ? normaliseTitleForComparison(normalizedTitle)
      : normalizedTitle

    // Find existing group with a similar artist and title (or exact match for numbered titles)
    const existingGroupKey = Object.keys(groups).find((key) => {
      const [groupArtist, groupTitle, groupTitleWithNumber, groupDesign] =
        key.split('||')

      const artistMatch =
        stringSimilarity.compareTwoStrings(groupArtist, normalizedArtist) > 0.8

      if (isClothingItem) {
        // For clothing items, group by exact design
        return artistMatch && groupDesign === design
      } else if (hasNumber) {
        // If the current title has a number, match must be exact including the number
        return artistMatch && groupTitleWithNumber === normalizedTitle
      } else {
        // Otherwise, allow for fuzzy matching on title
        return (
          artistMatch &&
          stringSimilarity.compareTwoStrings(groupTitle, baseTitle) > 0.8
        )
      }
    })

    if (existingGroupKey) {
      groups[existingGroupKey].push(item)
    } else {
      const groupKey = isClothingItem
        ? `${normalizedArtist}||${baseTitle}||${normalizedTitle}||${design}`
        : `${normalizedArtist}||${baseTitle}||${normalizedTitle}`
      groups[groupKey] = [item]
    }
  })

  return Object.values(groups)
}
