const DatePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <>
      <div className="hidden md:inline-flex flex mb-2 space-x-4 mx-2 h-100 w-full">
        <div>
          <div className={'text-xs font-bold mb-4'}>FROM</div>
          <input
            type="date"
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
          />
        </div>
        <div>
          <div className="text-xs font-bold mb-4">TO</div>
          <input
            type="date"
            onChange={(e) => setEndDate(e.target.value)}
            value={endDate}
          />
        </div>
      </div>
      <div className="md:hidden flex text-xs w-full items-center h-[40px]">
        <div className="font-bold w-1/6">FROM</div>
        <input
          type="date"
          className="w-2/6 pr-4"
          onChange={(e) => setStartDate(e.target.value)}
          value={startDate}
        />
        <div className="font-bold w-1/6">TO</div>
        <input
          type="date"
          className="w-2/6"
          onChange={(e) => setEndDate(e.target.value)}
          value={endDate}
        />
      </div>
    </>
  )
}

export default DatePicker
