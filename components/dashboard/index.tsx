import { sumPrices } from '@/lib/data-functions'
import SaleSummary from '../saleSummary'
import SalesChart from '../charts/salesChart'
import PaymentsChart from '../charts/paymentsChart'
import SalesCumChart from '../charts/salesCumChart'
import SalesDayHourChart from '../charts/hoursChart'
import SalesMonthChart from '../charts/monthsChart'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import Select from '../input/select'
import { chartOptions } from './schema'
import {
  summarisePaymentData,
  summariseSalesData,
  summariseSalesDataByDayAndHour,
  summariseSalesDataByMonth,
} from '../charts/functions'
import { numFormats } from '../charts/ref'

const Dashboard = ({ sales, payments, stock }) => {
  const [startDate, setStartDate] = useState('2018-11-03')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [chartOption, setChartOption] = useState('sales')

  const totalTake = sumPrices(sales, null, 'vendorPrice')
  const totalPaid = payments?.reduce((prev, pay) => prev + pay?.amount, 0)

  const paymentSummary = useMemo(
    () => summarisePaymentData(payments),
    [payments]
  )
  const salesSummary = useMemo(() => summariseSalesData(sales), [sales])
  const salesSummaryHours = useMemo(
    () => summariseSalesDataByDayAndHour(sales),
    [sales]
  )
  const salesSummaryMonths = useMemo(
    () => summariseSalesDataByMonth(sales),
    [sales]
  )
  // const similarStock = groupSimilarStockItems(stock)
  // console.log(salesSummaryMonths)
  // console.log(similarStock?.filter((list) => list?.length > 1))
  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between">
        <div>
          <div className="flex mb-2 items-center space-x-4 h-100">
            <div className={'text-xs font-bold'}>VIEW</div>
            <Select
              options={chartOptions}
              value={null}
              onChange={(val) => setChartOption(val)}
            />
            <div className={'text-xs font-bold'}>FROM</div>
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
            <div className="text-xs font-bold">TO</div>
            <input
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
            />
          </div>
        </div>
        <SaleSummary totalTake={totalTake} totalPaid={totalPaid} />
      </div>
      {chartOption === 'sales' && (
        <SalesChart
          salesSummary={salesSummary}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      {chartOption === 'payments' && (
        <PaymentsChart
          paymentSummary={paymentSummary}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      {chartOption === 'cumSales' && (
        <SalesCumChart
          salesSummary={salesSummary}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      {/* {chartOption === 'salesDayHour' && (
        <SalesDayHourChart
          salesSummary={salesSummaryHours}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      {chartOption === 'salesMonth' && (
        <SalesMonthChart
          salesSummary={salesSummaryMonths}
          startDate={startDate}
          endDate={endDate}
        />
      )} */}
    </div>
  )
}

export default Dashboard
