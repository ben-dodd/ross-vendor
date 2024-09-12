import { getItemDisplayName } from '@/lib/data-functions'

const PaymentItem = ({ payment }) => {
  console.log(payment)
  return (
    <div className={'w-full p-2 border-b border-gray-300'}>
      <div className="w-full h-full flex justify-between px-2 items-start">
        <div className="font-bold">{payment?.date?.value}</div>
        <div
          className={`text-right ${payment?.amount?.red ? 'text-red-500' : ''}`}
        >
          {payment?.amount?.value}
        </div>
      </div>
      <div className="flex justify-between px-2">
        <div className="pr-2">{payment?.reference?.value}</div>
        <div className="font-bold text-right text-xs">
          {payment?.type?.value}
        </div>

        {/* <div
          className={`text-xs font-bold text-center p-1 rounded-md h-[20px]  w-[100px] ${
            payment?.type?.value === 'TRANSFER FROM'
              ? 'bg-green-200'
              : 'bg-orange-200'
          }`}
        >
          {payment?.type?.value}
        </div> */}
      </div>
    </div>
  )
}

export default PaymentItem
