import { writePrice } from '@/lib/data-functions'
import dayjs from 'dayjs'

const SalesItem = ({ sale }) => {
  return (
    <div
      key={`${sale?.sale_id}-${sale?.item_id}`}
      className="flex py-2 text-xs border-b hover:bg-gradient-to-r from-white via-orange-200 to-white"
    >
      <div className="w-3/12 px-1 md:w-1/12">
        <div className="hidden md:inline">
          {dayjs(sale?.date_sale_closed).format('DD/MM/YYYY')}
        </div>
        <div className="md:hidden">
          {dayjs(sale?.date_sale_closed).format('DD/MM/YY')}
        </div>
      </div>
      <div className="w-1/12 px-1 hidden md:inline">{sale?.quantity}</div>
      <div className="w-1/12 px-1">{sale?.format}</div>
      <div className="w-2/12 px-1">{sale?.artist}</div>
      <div className="w-2/12 md:w-3/12 px-1">{`${sale?.title}${
        sale?.is_refunded ? ' [REFUNDED]' : ''
      }`}</div>
      <div
        className={`w-2/12 md:w-1/12 px-1 text-right${
          sale?.is_refunded ? ' line-through' : ''
        }`}
      >
        {writePrice(sale?.total_sell)}
      </div>
      <div
        className={`w-1/12 px-1 text-right hidden md:inline${
          sale?.is_refunded ? ' line-through' : ''
        }`}
      >
        {writePrice(sale?.store_cut)}
      </div>
      <div
        className={`w-1/12 md:w-1/12 px-1 text-right${
          sale?.is_refunded ? ' line-through' : ''
        }`}
      >
        {writePrice(sale?.vendor_cut)}
      </div>
      <div className={`w-1/12 md:w-1/12 px-1 text-right`}>
        {sale?.margin?.toFixed?.(1)}%
      </div>
    </div>
  )
}

export default SalesItem
