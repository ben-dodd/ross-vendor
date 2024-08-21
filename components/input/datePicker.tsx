const DatePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <div className="flex items-start mb-2">
      <div className="font-bold mr-2">FROM</div>
      <input
        type="date"
        onChange={(e) => setStartDate(e.target.value)}
        value={startDate}
      />
      <div className="font-bold mx-2">TO</div>
      <input
        type="date"
        onChange={(e) => setEndDate(e.target.value)}
        value={endDate}
      />
    </div>
  )
}

export default DatePicker
