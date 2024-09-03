import { filterByDates, writePrice } from '@/lib/data-functions'
import dayjs from 'dayjs'

export const csvSchema = [
  { header: 'Payment Date', field: 'date', format: 'D MMMM YYYY' },
  { header: 'Payment Type', field: 'type' },
  { header: 'Payment Amount (NZD)', field: 'amount', format: '$' },
  { header: 'Reference', field: 'reference' },
]

export const sortOptions = [
  { value: 'date', label: 'Date (Newest to Oldest)' },
  { value: 'dateRev', label: 'Date (Oldest to Newest)' },
  { value: 'type', label: 'Payment Type' },
  { value: 'amount', label: 'Amount (Low to High)' },
  { value: 'amountRev', label: 'Amount (High to Low)' },
  { value: 'reference', label: 'Reference' },
]

export const tableSchema = [
  { width: 1, label: 'DATE PAID', field: 'date' },
  { width: 2, label: 'AMOUNT PAID', field: 'amount', align: 'right' },
  { width: 2, label: 'PAYMENT TYPE', field: 'type' },
  { width: 7, label: 'REFERENCE', field: 'reference' },
]

export const tablePayments = (payments) =>
  payments?.map((payment) => ({
    date: { value: dayjs(payment?.date).format('DD/MM/YY') },
    amount: { value: writePrice(payment?.amount), red: payment?.amount < 0 },
    type: { value: payment?.type?.toUpperCase?.() },
    reference: { value: payment?.reference },
  }))

export const filterPayments = (
  payments,
  startDate,
  endDate,
  search,
  sortOption
) => {
  return filterByDates(payments, startDate, endDate, 'date')
    ?.filter(
      (payment) =>
        search === '' ||
        `${payment?.type} ${payment?.reference}`
          ?.toLowerCase()
          ?.includes(search?.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'dateRev':
          return dayjs(a.date).diff(dayjs(b.date)) // Oldest to Newest
        case 'type':
          return a.type.localeCompare(b.type) // Sort by Type
        case 'reference':
          return a.reference.localeCompare(b.reference) // Sort by reference
        case 'amount':
          return a.amount - b.amount // Sort by Price (assuming amount is the price)
        case 'amountRev':
          return b.amount - a.amount // Sort by Price (assuming amount is the price)
        default:
          return 0 // No sorting if the key doesn't match any case
      }
    })
}
