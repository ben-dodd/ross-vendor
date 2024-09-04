const TableHeader = ({ schema }) => {
  return (
    <div className="flex bg-black py-2 text-white text-xs">
      {schema?.map((col, i) => (
        <div
          key={i}
          className={`w-${col?.width || '1'}/12 px-1 flex-none${
            col?.align === 'right'
              ? ' text-right'
              : col?.align === 'center'
              ? col?.align === ' text-center'
              : ''
          }`}
        >
          {col?.label}
        </div>
      ))}
    </div>
  )
}

export default TableHeader
