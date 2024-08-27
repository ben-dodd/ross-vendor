import {
  summarisePaymentsData,
  summariseSalesData,
  sumPrices,
} from '@/lib/data-functions'
import SaleSummary from '../saleSummary'
import SalesAndPaymentsByMonthChart from '../charts/salesAndPaymentsByMonth'

const Dashboard = ({ sales, payments, stock }) => {
  const totalTake = sumPrices(sales, null, 'vendorPrice')
  const totalPaid = payments?.reduce((prev, pay) => prev + pay?.amount, 0)
  const paymentSummary = summarisePaymentsData(payments)
  const salesSummary = summariseSalesData(sales)
  console.log(paymentSummary)
  console.log(salesSummary)
  return (
    <div>
      <SaleSummary totalTake={totalTake} totalPaid={totalPaid} />
      <SalesAndPaymentsByMonthChart
        salesSummary={salesSummary}
        paymentSummary={paymentSummary}
      />
    </div>
  )
}

export default Dashboard
