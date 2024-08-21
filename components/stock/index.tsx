import { filterInventory } from '@/lib/data-functions'
import { StockObject } from '@/lib/types'
import StockItem from './item'
import { useState } from 'react'
import Title from '../layout/title'
import Search from '../input/search'

const Stock = ({ vendorStock }) => {
  const [stockSearch, setStockSearch] = useState('')
  return (
    <div className="w-full">
      <Title title={'RIDE ON SUPER SOUND STOCK'} />
      <Search value={stockSearch} setValue={setStockSearch} />
      {filterInventory({
        inventory: vendorStock?.sort((a: StockObject, b: StockObject) => {
          if (a?.quantity === b?.quantity) return 0
          if (a?.quantity < 1) return 1
          if (b?.quantity < 1) return -1
          return 0
        }),
        search: stockSearch,
        slice: 1000,
        emptyReturn: true,
      })?.map((item: StockObject) => (
        <StockItem key={item.id} item={item} />
      ))}
    </div>
  )
}

export default Stock
