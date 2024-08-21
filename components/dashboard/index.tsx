import { sumPrices } from '@/lib/data-functions'
import SaleSummary from '../saleSummary'

const Dashboard = ({ sales, payments, stock }) => {
  const totalTake = sumPrices(sales, null, 'vendorPrice')
  const totalPaid = payments?.reduce((prev, pay) => prev + pay?.amount, 0)
  return (
    <div>
      <SaleSummary totalTake={totalTake} totalPaid={totalPaid} />
    </div>
  )
}

export default Dashboard
