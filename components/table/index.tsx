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
      <div className="sticky top-0 w-full">
        {showPagination && (
          <TablePagination
            pagination={pagination}
            setPagination={setPagination}
          />
        )}
        {showHeader && <TableHeader schema={schema} />}
      </div>
      {data?.length === 0 ? (
        <div className="font-bold text-center w-full p-2">{`NO ROWS FOUND`}</div>
      ) : (
        data?.map((row, i) => (
          <TableRow key={i} rowData={row} schema={schema} />
        ))
      )}
    </div>
  )
}

export default Table
