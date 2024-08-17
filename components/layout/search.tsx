import { IconSearch, IconX } from '@tabler/icons-react'

const Search = ({ value, setValue }) => {
  const handleSearch = (e) => setValue(e.target.value)
  const clearInput = () => setValue('')
  return (
    <div
      className={`flex flex-1 my-1 p-1 rounded-lg justify-between items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200 ${
        value && 'bg-blue-100 hover:bg-blue-200'
      }`}
    >
      <div className="flex items-center flex-1">
        <div className="pl-3 pr-1">
          <IconSearch />
        </div>
        <input
          className="w-full px-2 text-sm outline-none bg-transparent text-xl"
          value={value || ''}
          onChange={handleSearch}
          placeholder="Search..."
        />
      </div>
      <div className="text-xs mr-2 hover:text-gray-500">
        <button onClick={clearInput}>
          <IconX />
        </button>
      </div>
    </div>
  )
}

export default Search
