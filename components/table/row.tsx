const TableRow = ({ schema, rowData }) => {
  return (
    <div className="flex py-2 text-xs border-b hover:bg-gradient-to-r from-white via-orange-200 to-white overflow-hidden">
      {schema?.map((col, i) => (
        <div
          key={i}
          className={`w-${col?.width || '1'}/12 px-1 flex-none${
            col?.align === 'right'
              ? ' text-right pr-2'
              : col?.align === 'center'
              ? ' text-center'
              : ''
          } ${rowData[col?.field]?.line ? ' line-through' : ''} ${
            rowData[col?.field]?.red ? ' text-red-500' : ''
          }`}
          style={{ minWidth: '0' }}
        >
          {rowData[col?.field]?.value}
        </div>
      ))}
    </div>
  )
}

export default TableRow
