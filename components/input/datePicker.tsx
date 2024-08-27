const DatePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <div className="flex mb-2 space-x-4 h-100">
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
  )
}

export default DatePicker
