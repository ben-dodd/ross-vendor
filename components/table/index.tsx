import TableHeader from './header'
import TablePagination from './pagination'
import TableRow from './row'

const Table = ({
  schema,
  data,
  pagination,
  setPagination,
  showHeader = true,
  showPagination = true,
}) => {
  return (
    <div>
      {showHeader && <TableHeader schema={schema} />}
      {data?.map((row, i) => (
        <TableRow key={i} rowData={row} schema={schema} />
      ))}
      {showPagination && (
        <TablePagination
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </div>
  )
}

export default Table
