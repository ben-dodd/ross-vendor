import PaymentItem from './item'
import Title from '../layout/title'
import PaymentsTableHeader from './tableHeader'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { downloadCsv, generateCsv } from '@/lib/csv'
import Search from '../input/search'
import DatePicker from '../input/datePicker'
import Select from '../input/select'
import { filterByDates } from '@/lib/data-functions'

export default function Payments({ payments }) {
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('2018-11-03')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [filteredPayments, setFilteredPayments] = useState(payments)
  const [sortOption, setSortOption] = useState('date')

  useEffect(() => {
    const filtered = filterByDates(
      payments,
      startDate,
      endDate,
      'date'
    )?.filter(
      (payment) =>
        search === '' ||
        `${payment?.type} ${payment?.reference}`
          ?.toLowerCase()
          ?.includes(search?.toLowerCase())
    )
    setFilteredPayments(
      filtered.sort((a, b) => {
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
    )
  }, [payments, startDate, endDate, search, sortOption])

  const sortOptions = [
    { value: 'date', label: 'Newest to Oldest' },
    { value: 'dateRev', label: 'Oldest to Newest' },
    { value: 'type', label: 'Sort by Payment Type' },
    { value: 'amount', label: 'Sort by Amount (Low to High)' },
    { value: 'amountRev', label: 'Sort by Amount (High to Low)' },
    { value: 'reference', label: 'Sort by Reference' },
  ]

  const csvSchema = [
    { header: 'Payment Date', field: 'date', format: 'D MMMM YYYY' },
    { header: 'Payment Type', field: 'type' },
    { header: 'Payment Amount (NZD)', field: 'amount', format: '$' },
    { header: 'Reference', field: 'reference' },
  ]
  const csvContent = generateCsv(payments, csvSchema)

  const downloadData = () =>
    downloadCsv(csvContent, `ross-payments-${dayjs()?.format('YYYY-MM-DD')}`)

  return (
    <div className="w-full">
      <Title
        title={'RIDE ON SUPER SOUND PAYMENTS'}
        downloadData={downloadData}
      />
      <div className="flex justify-between items-center space-x-8 py-2">
        <Search value={search} setValue={setSearch} />
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <Select
          options={sortOptions}
          value={null}
          onChange={(val) => setSortOption(val)}
        />
      </div>
      {filteredPayments?.length === 0 ? (
        <div>NO PAYMENTS FOUND</div>
      ) : (
        <div>
          <PaymentsTableHeader />
          {filteredPayments?.map((pay, i) => (
            <PaymentItem key={i} pay={pay} />
          ))}
        </div>
      )}
    </div>
  )
}
