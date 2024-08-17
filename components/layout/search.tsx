const Search = ({ value, setValue }) => {
  return (
    <div>
      <input
        type="text"
        className="w-full p-1 border border-gray-200 mb-8"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search.."
      />
    </div>
  )
}

export default Search
