import { getItemDisplayName } from '@/lib/data-functions'

const SaleItem = ({ sale }) => {
  return (
    <div className={'w-full p-2 border-b border-gray-300'}>
      <div className="w-full h-full flex justify-between px-2 items-start">
        <div className="font-bold">{sale?.date?.value}</div>
        <div>
          <div className="text-right">{sale?.retailPrice?.value}</div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="px-2">{`${sale?.qtySold?.value} x ${getItemDisplayName({
          title: sale?.title?.value,
          artist: sale?.artist?.value,
        })}`}</div>
        <div className="text-xs text-gray-500 text-right whitespace-nowrap">
          {`(${sale?.vendorTake?.value} FOR YOU)`}
        </div>
      </div>
    </div>
  )
}

export default SaleItem
