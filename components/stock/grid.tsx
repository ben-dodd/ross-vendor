import Pagination from '@/components/table/pagination'
import StockItem from './item'

const StockGrid = ({ data, pagination, setPagination }) => {
  return (
    <div>
      <Pagination pagination={pagination} setPagination={setPagination} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {data.map((item, index) => (
          <StockItem key={index} item={item} />
        ))}
      </div>
    </div>
  )
}

export default StockGrid
