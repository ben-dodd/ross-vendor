import Pagination from '@/components/table/pagination'
import SaleItem from './item'

const SalesGrid = ({ data, pagination, setPagination }) => {
  return (
    <div>
      <Pagination pagination={pagination} setPagination={setPagination} />
      <div className="mt-4">
        {data.map((item, index) => (
          <SaleItem key={index} sale={item} />
        ))}
      </div>
    </div>
  )
}

export default SalesGrid
