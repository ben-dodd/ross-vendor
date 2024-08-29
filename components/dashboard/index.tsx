import {
  groupSimilarStockItems,
  summarisePaymentData,
  summariseSalesData,
  summariseSalesDataByDayAndHour,
  summariseSalesDataByMonth,
  sumPrices,
} from '@/lib/data-functions'
import SaleSummary from '../saleSummary'
import SalesChart from '../charts/salesChart'
import PaymentsChart from '../charts/paymentsChart'
import SalesCumChart from '../charts/salesCumChart'
import SalesDayHourChart from '../charts/hoursChart'
import SalesMonthChart from '../charts/monthsChart'

const Dashboard = ({ sales, payments, stock }) => {
  const totalTake = sumPrices(sales, null, 'vendorPrice')
  const totalPaid = payments?.reduce((prev, pay) => prev + pay?.amount, 0)
  const paymentSummary = summarisePaymentData(payments)
  const salesSummary = summariseSalesData(sales)
  const salesSummaryHours = summariseSalesDataByDayAndHour(sales)
  const salesSummaryMonths = summariseSalesDataByMonth(sales)
  const similarStock = groupSimilarStockItems(stock)
  console.log(salesSummaryMonths)
  console.log(similarStock?.filter((list) => list?.length > 1))
  return (
    <div>
      <SaleSummary totalTake={totalTake} totalPaid={totalPaid} />
      <SalesChart salesSummary={salesSummary} />
      <PaymentsChart paymentSummary={paymentSummary} />
      <SalesCumChart salesSummary={salesSummary} />
      <SalesDayHourChart salesSummary={salesSummaryHours} />
      <SalesMonthChart salesSummary={salesSummaryMonths} />
    </div>
  )
}

export default Dashboard
