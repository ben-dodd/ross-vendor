const SalesTableHeader = () => {
  return (
    <div className="flex bg-black py-2 text-white text-xs">
      <div className="w-3/12 px-1 md:w-1/12">DATE SOLD</div>
      <div className="w-1/12 px-1 hidden md:inline">STOCK REMAINING</div>
      <div className="w-1/12 px-1">FORMAT</div>
      <div className="w-2/12 px-1">ARTIST</div>
      <div className="w-2/12 px-1 md:w-3/12">TITLE</div>
      <div className="w-2/12 px-1 text-right md:w-1/12">RETAIL PRICE</div>
      <div className="w-1/12 px-1 text-right hidden md:inline">ROSS TAKE</div>
      <div className="w-1/12 px-1 md:w-1/12 text-right">VENDOR TAKE</div>
      <div className="w-1/12 px-1 md:w-1/12 text-right">MARGIN</div>
    </div>
  )
}

export default SalesTableHeader
