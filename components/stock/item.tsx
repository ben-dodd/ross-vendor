import { writePrice } from '@/lib/data-functions'

const StockItem = ({ item }) => {
  return (
    <div
      key={`${item?.vendor_id}-${item?.id}`}
      className="flex py-2 text-xs border-b hover:bg-gradient-to-r from-white via-orange-200 to-white"
    >
      <div className="w-2/12 px-1">{item?.sku}</div>
      <div className="w-2/12 px-1">{item?.artist}</div>
      <div className="w-2/12 px-1">{item?.title}</div>
      <div className="w-1/12 px-1">{item?.format}</div>
      <div className="w-1/12 px-1">{item?.is_new ? 'Yes' : 'No'}</div>
      <div className="w-1/12 px-1">{item?.cond}</div>
      <div className="w-1/12 px-1 text-right">
        {writePrice(item?.vendor_cut)}
      </div>
      <div className="w-1/12 px-1 text-right">
        {writePrice(item?.total_sell)}
      </div>
      <div className="w-1/12 px-1 text-right">
        {item?.margin?.toFixed?.(1)}%
      </div>
      <div className="w-1/12 px-1 text-right">{item?.quantity}</div>
      <div className="w-1/12 px-1 text-right">{item?.quantity_sold}</div>
    </div>
  )
}

export default StockItem
