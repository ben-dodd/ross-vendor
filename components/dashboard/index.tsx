import {
  summarisePaymentData,
  summariseSalesData,
  sumPrices,
} from '@/lib/data-functions'
import SaleSummary from '../saleSummary'
import SalesChart from '../charts/salesChart'
import PaymentsChart from '../charts/paymentsChart'

const Dashboard = ({ sales, payments, stock }) => {
  const totalTake = sumPrices(sales, null, 'vendorPrice')
  const totalPaid = payments?.reduce((prev, pay) => prev + pay?.amount, 0)
  const paymentSummary = summarisePaymentData(payments)
  const salesSummary = summariseSalesData(sales)
  console.log(stock)
  return (
    <div>
      <SaleSummary totalTake={totalTake} totalPaid={totalPaid} />
      <SalesChart salesSummary={salesSummary} />
      <PaymentsChart paymentSummary={paymentSummary} />
    </div>
  )
}

export default Dashboard
