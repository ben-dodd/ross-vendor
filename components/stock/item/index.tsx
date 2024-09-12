import { getImageSrc, getItemDisplayName } from '@/lib/data-functions'

const StockItem = ({ item }) => {
  const stockItem = {
    sku: item?.sku?.value,
    artist: item?.artist?.value,
    title: item?.title?.value,
    format: item?.format?.value,
    new: item?.new?.value,
    condition: item?.condition?.value,
    vendorCut: item?.vendorCut?.value,
    totalSell: item?.totalSell?.value,
    margin: item?.margin?.value,
    qtyInStock: item?.qtyInStock?.value,
    qtySold: item?.qtySold?.value,
    // For Grid only
    image_url: item?.image_url?.value,
    section: item?.section?.value,
    // isBestSeller: item?.isBestSeller?.value,
  }
  return (
    <div
      className={
        'relative flex w-full p-2 shadow-sm hover:shadow-md items-center justify-between border border-gray-300 rounded-md'
      }
    >
      {/* {stockItem?.qtySold > 5 && (
        <div className="absolute top-0 right-0 w-20 h-20 flex items-center justify-center text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-yellow-500 clip-star"></div>
            <span className="absolute inset-0 flex items-center justify-center z-10">
              TOP SELLER
            </span>
          </div>
        </div>
      )} */}
      <div className={`w-[120px] h-full flex flex-col justify-start`}>
        <img
          className="object-cover w-full aspect-ratio-square"
          src={getImageSrc(stockItem)}
          alt={stockItem?.title || 'Stock image'}
        />
        <div className="h-8 text-lg font-bold text-center bg-black text-white w-[120px]">
          {stockItem?.sku}
        </div>
      </div>
      <div className="w-full h-full flex justify-between px-2 items-start">
        <div className="pr-2 h-full w-full flex flex-col justify-between">
          <div>
            <div className="font-bold">{getItemDisplayName(stockItem)}</div>
            <>
              {stockItem?.qtyInStock === 0 ? (
                <div className={'text-red-500 font-bold'}>OUT OF STOCK</div>
              ) : (
                <div className={``}>{`${stockItem?.qtyInStock} ${
                  stockItem?.qtyInStock > 1 ? 'COPIES' : 'COPY'
                } IN STORE`}</div>
              )}
            </>
          </div>
          <div className="">{`${
            stockItem?.qtySold === 0
              ? 'NO COPIES SOLD'
              : stockItem?.qtySold > 1
              ? `${stockItem?.qtySold} COPIES SOLD`
              : '1 COPY SOLD'
          }`}</div>
        </div>
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="text-lg text-right">{stockItem?.totalSell}</div>
            <div className="text-xs text-gray-500 text-right whitespace-nowrap">
              {`(${stockItem?.vendorCut} FOR YOU)`}
            </div>
          </div>
          <div>
            {stockItem?.section && (
              <div
                className={`text-xs font-bold text-center p-1 rounded-md bg-gray-200 mb-2`}
              >
                {stockItem?.section}
              </div>
            )}
            <div
              className={`text-xs font-bold text-center p-1 rounded-md ${
                stockItem?.new === 'Yes' ? 'bg-green-200' : 'bg-orange-200'
              }`}
            >
              {stockItem?.new === 'Yes' ? 'NEW' : 'USED'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockItem
