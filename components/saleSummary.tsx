import { writePrice } from '@/lib/data-functions'

const SaleSummary = ({ totalTake, totalPaid }) => {
  return (
    <div className="mb-2 flex justify-between">
      <div />
      <div className="w-full text-sm font-bold text-right md:w-2/5">
        <div className="w-full flex">
          <div className="p-2 w-3/4 whitespace-nowrap bg-gradient-to-r from-white to-gray-300 hover:to-red-300">
            {`TOTAL TAKE TO DATE`}
          </div>
          <div className="pl-2 py-2 w-1/12 text-left">$</div>
          <div className="py-2 w-2/12">{writePrice(totalTake, true)}</div>
        </div>
        <div className="w-full flex">
          <div className="p-2 w-3/4 whitespace-nowrap bg-gradient-to-r from-white to-gray-200 hover:to-orange-200">
            {`TOTAL TAKE TO DATE`}
          </div>
          <div className="pl-2 py-2 w-1/12 text-left">$</div>
          <div className="py-2 w-2/12">{writePrice(totalPaid, true)}</div>
        </div>
        <div className="w-full flex">
          <div className="p-2 w-3/4 whitespace-nowrap bg-gradient-to-r from-white to-gray-100 hover:to-green-100">
            PAYMENT OWING ►
          </div>
          <div className="pl-2 py-2 w-1/12 text-left">$</div>
          <div className="py-2 w-2/12">
            {writePrice(totalTake - totalPaid, true)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleSummary
