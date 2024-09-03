const TableRow = ({ schema, rowData }) => {
  return (
    <div className="flex py-2 text-xs border-b hover:bg-gradient-to-r from-white via-orange-200 to-white">
      {schema?.map((col, i) => (
        <div
          key={i}
          className={`w-${col?.width || '1'}/12 px-1${
            col?.line && ' line-through'
          }`}
        >
          {rowData[col?.field]}
        </div>
      ))}
    </div>
  )
}

export default TableRow
