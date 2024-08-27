import dayjs from 'dayjs'
import { writePrice } from './data-functions'

const escapeCsvField = (field) => {
  if (typeof field === 'string') {
    return `"${field.replace(/"/g, '""')}"` // Escape double quotes by doubling them
  }
  return field
}

export const generateCsv = (data, schema) => {
  // Convert header to CSV row
  const headerRow = schema
    .map?.((column) => column?.header)
    ?.map(escapeCsvField)
    .join(',')
  // Convert data rows to CSV rows
  const rows =
    data?.map?.((row) =>
      schema
        ?.map((column) =>
          column?.format
            ? column?.format === '$'
              ? writePrice(row?.[column?.field], true)
              : dayjs(row?.[column?.field])?.format(column?.format)
            : row?.[column?.field]
        )
        ?.map(escapeCsvField)
        .join(',')
    ) || []
  return [headerRow, ...rows].join('\n')
}

// To download the CSV file
export const downloadCsv = (
  csvContent,
  filename = `rideonsupersound-${dayjs()?.format('YYYY-MM-DD')}.csv`
) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    // feature detection
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
