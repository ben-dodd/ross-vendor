import { useMemo, useState } from "react";

// Material UI Components
import {
  useTable,
  usePagination,
  useResizeColumns,
  useBlockLayout,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";

// Material UI Icons
import SearchIcon from "@mui/icons-material/Search";
import MdFirstPage from "@mui/icons-material/FirstPage";
import MdNavigateBefore from "@mui/icons-material/NavigateBefore";
import MdNavigateNext from "@mui/icons-material/NavigateNext";
import MdLastPage from "@mui/icons-material/LastPage";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  skipPageResetRef,
  colorLight,
}) {
  const [searchValue, setSearchValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    // skipPageResetRef.current = true;
    setGlobalFilter(value || undefined);
  }, 100);
  return (
    <div
      className={`flex items-center ring-1 ring-gray-400 rounded-md mr-1 my-2 ml-3 w-auto ${
        colorLight
          ? `bg-gray-100 hover:${colorLight}`
          : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      <div className="pl-3 pr-1">
        <SearchIcon />
      </div>
      <input
        className="w-full py-1 px-2 outline-none bg-transparent"
        value={searchValue || ""}
        onChange={(e) => {
          setSearchValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="SEARCH…"
      />
    </div>
  );
}

interface TableProps {
  color?: string;
  colorLight?: string;
  colorDark?: string;
  data?: any[];
  columns?: any[];
  showFooter?: boolean;
  heading?: string;
  pageSize?: number;
  onClickRow?: Function;
  sortOptions?: any;
}

function Table({
  color,
  colorLight,
  colorDark,
  data,
  columns,
  showFooter,
  heading,
  pageSize,
  onClickRow,
  sortOptions,
}: TableProps) {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
    }),
    []
  );

  // const skipPageResetRef = useRef();
  // useEffect(() => {
  //   skipPageResetRef.current = false;
  // });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // setPageSize,
    allColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // autoResetPage: !skipPageResetRef.current,
      // autoResetSortBy: !skipPageResetRef.current,
      // autoResetFilters: !skipPageResetRef.current,
      initialState: {
        pageSize: pageSize || 15,
        sortBy: sortOptions || [],
      },
    },
    useBlockLayout,
    useResizeColumns,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="ml-1">
      <div
        className={`flex justify-between items-center px-2 mb-1 ${color || ""}`}
      >
        {heading ? (
          <div className={`text-4xl font-bold uppercase`}>{heading}</div>
        ) : (
          <div />
        )}
        <div className="flex">
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            skipPageResetRef={null}
            colorLight={colorLight || null}
          />
        </div>
      </div>
      <div className="overflow-x-scroll w-full">
        <table {...getTableProps()} className="table-auto w-full">
          <thead className="sticky">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    className={`border border-white ${
                      color
                        ? `${color} hover:${colorDark}`
                        : "bg-gray-500 hover:bg-gray-800"
                    } text-left px-2 truncate`}
                    {...column.getHeaderProps()}
                  >
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " ↓"
                            : " ↑"
                          : ""}
                      </span>
                    </div>
                    <div
                      className={`inline-block w-1 z-10 h-full absolute right-0 top-0 translate-x-1/2 cursor-resize bg-white`}
                      {...column.getResizerProps()}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              let rowProps = row.getRowProps();
              // console.log(row);
              return (
                <tr
                  {...rowProps}
                  className={`${
                    row?.cells[1]?.value === "complete" ||
                    row?.cells[5]?.value === "Audio" ||
                    row?.cells[4]?.value === "Band"
                      ? "bg-gray-100"
                      : row?.cells[1]?.value === "layby" ||
                        row?.cells[5]?.value === "Literature" ||
                        row?.cells[4]?.value === "Label"
                      ? "bg-yellow-100"
                      : row?.cells[1]?.value === "parked"
                      ? "bg-green-100"
                      : "bg-blue-100"
                  } ${
                    row?.cells[9]?.value === 0 && "text-gray-600"
                  } opacity-70 hover:opacity-100`}
                >
                  {row.cells.map((cell: any) => {
                    return (
                      <td
                        key={cell?.id}
                        className="border border-white truncate relative pl-2 pr-4 border-r-4"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {showFooter && (
            <tfoot>
              {footerGroups.map((group) => (
                <tr {...group.getFooterGroupProps()}>
                  {group.headers.map((column) => (
                    <td {...column.getFooterProps()}>
                      <b>{column.render("Footer")}</b>
                    </td>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
      <div className="flex justify-end items-center py-2">
        <span>
          Page{" "}
          <strong>
            {(state?.pageIndex || 0) + 1} of {pageOptions.length}
          </strong>
        </span>
        <button
          className="icon-button"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <MdFirstPage />
        </button>
        <button
          className="icon-button"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <MdNavigateBefore />
        </button>
        <button
          className="icon-button"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <MdNavigateNext />
        </button>
        <button
          className="icon-button"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <MdLastPage />
        </button>
      </div>
    </div>
  );
}

export default Table;
