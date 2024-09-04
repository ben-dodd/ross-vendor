import {
  PaymentData,
  PaymentMonthlySummary,
  SaleData,
  SaleMonthlySummary,
} from '@/lib/types'
import dayjs from 'dayjs'
import { numFormats } from './ref'

// Helper function to get the day of the week and hour
const getDayOfWeek = (date: string) => dayjs(date).format('ddd')
const getHourOfDay = (date: string) => dayjs(date).format('H')
const getMonth = (date: string) => dayjs(date).format('MMM')

export const summariseSalesDataByDayAndHour = (salesData: SaleData[]) => {
  // Initialize summary object
  const summary: Record<string, number> = {}

  // Process each sale
  salesData.forEach((sale) => {
    const dayOfWeek = getDayOfWeek(sale.date_sale_closed)
    const hourOfDay = getHourOfDay(sale.date_sale_closed)
    const label = `${dayOfWeek} ${hourOfDay}` // Format for display
    const totalSell = sale.total_sell / 100 // Convert to dollars

    if (!summary[label]) {
      summary[label] = 0
    }
    summary[label] += totalSell
  })

  return summary
}

export const summariseSalesDataByMonth = (salesData: SaleData[]) => {
  // Initialize summary object
  const summary: Record<string, number> = {}

  // Process each sale
  salesData.forEach((sale) => {
    const month = getMonth(sale.date_sale_closed)
    const label = month // Format for display
    const totalSell = sale.total_sell / 100 // Convert to dollars

    if (!summary[label]) {
      summary[label] = 0
    }
    summary[label] += totalSell
  })

  return summary
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

  // Collect all formats and their total vendor cuts
  const formatTotals: Record<string, { totalVendorCut: number }> = {}

  Object.values(summary).forEach((monthData) => {
    Object.entries(monthData.formatDetails).forEach(([format, data]) => {
      if (!formatTotals[format]) {
        formatTotals[format] = { totalVendorCut: 0 }
      }
      formatTotals[format].totalVendorCut += data.totalVendorCut
    })
  })

  // Determine top formats by total vendor cut
  const topFormats = Object.entries(formatTotals)
    .sort((a, b) => b[1].totalVendorCut - a[1].totalVendorCut)
    .slice(0, numFormats)
    .map(([format]) => format)

  // Update summaries to include only top formats and an "Other" category
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

export const getTopSellingFormats = (sales: SaleMonthlySummary[]) => {
  // Collect all formats and their total vendor cuts
  const formatTotals: Record<string, number> = {}

  sales.forEach((item) => {
    Object.entries(item.formatDetails).forEach(([format, data]) => {
      if (!formatTotals[format]) {
        formatTotals[format] = 0
      }
      formatTotals[format] += data.totalVendorCut
    })
  })

  // Determine top formats by total vendor cut
  const sortedFormats = Object.entries(formatTotals)
    .sort((a, b) => b[1] - a[1]) // Sort by total vendor cut in descending order
    .slice(0, numFormats) // Get top 8 formats
    .map(([format]) => format)

  return sortedFormats
}
