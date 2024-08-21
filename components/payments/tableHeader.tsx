const PaymentsTableHeader = () => {
  return (
    <div className="flex bg-black py-2 text-white text-xs">
      <div className="w-2/12 md:w-1/12 px-1">DATE PAID</div>
      <div className="w-1/6 px-1 pr-4 text-right">AMOUNT PAID</div>
      <div className="w-1/6 px-1">PAYMENT TYPE</div>
      <div className="w-4/12 md:w-5/12 px-1">REFERENCE</div>
    </div>
  )
}

export default PaymentsTableHeader
