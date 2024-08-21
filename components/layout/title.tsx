const Title = ({ title, downloadData = null }) => {
  return (
    <div className="flex justify-between items-center bg-orange-800 text-white font-bold italic px-2 py-1 mb-2">
      <div>{title}</div>
      {downloadData && (
        <div
          onClick={downloadData}
          className={`uppercase px-4 py-1 cursor-pointer italic text-orange-600 hover:text-orange-300 bg-white font-black text-sm`}
        >
          DOWNLOAD DATA
        </div>
      )}
    </div>
  )
}

export default Title
