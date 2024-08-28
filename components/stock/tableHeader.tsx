const StockTableHeader = () => {
  return (
    <div className="flex bg-black py-2 text-white text-xs">
      <div className="w-2/12 px-1">SKU</div>
      <div className="w-2/12 px-1">ARTIST</div>
      <div className="w-2/12 px-1">TITLE</div>
      <div className="w-1/12 px-1">FORMAT</div>
      <div className="w-1/12 px-1">NEW</div>
      <div className="w-1/12 px-1">CONDITION</div>
      <div className="w-1/12 px-1 text-right">VENDOR CUT</div>
      <div className="w-1/12 px-1 text-right">TOTAL SELL</div>
      <div className="w-1/12 px-1 text-right">MARGIN</div>
      <div className="w-1/12 px-1 text-right">QTY IN STOCK</div>
      <div className="w-1/12 px-1 text-right">QTY SOLD</div>
    </div>
  )
}

export default StockTableHeader
