const Select = ({
  options,
  value,
  onChange,
  label = null,
  placeholder = null,
}) => {
  return (
    <div>
      {label && <div className={'text-sm font-bold'}>{label}</div>}
      <div
        className={`flex flex-1 my-1 p-1 rounded-lg justify-between items-center ring-1 ring-gray-400 w-auto bg-gray-100 hover:bg-gray-200 ${
          value && 'bg-blue-100 hover:bg-blue-200'
        }`}
      >
        <select
          className="w-full px-2 py-1 outline-none bg-transparent cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder || 'Select...'}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Select
