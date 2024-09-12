import Pagination from '@/components/table/pagination'
import PaymentItem from './item'

const PaymentsGrid = ({ data, pagination, setPagination }) => {
  return (
    <div>
      <Pagination pagination={pagination} setPagination={setPagination} />
      <div className="mt-4">
        {data.map((payment, index) => (
          <PaymentItem key={index} payment={payment} />
        ))}
      </div>
    </div>
  )
}

export default PaymentsGrid
