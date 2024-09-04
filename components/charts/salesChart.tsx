import { SaleMonthlySummary } from '@/lib/types'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import dayjs from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { coloursQual, numFormats } from './ref'
import { getTopSellingFormats } from './functions'

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
)

type SalesChartProps = {
  salesSummary: SaleMonthlySummary[]
  startDate: string
  endDate: string
}

const SalesChart = ({ salesSummary, startDate, endDate }: SalesChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const [activeFormats, setActiveFormats] = useState<string[]>([])

  // Filter salesSummary based on startDate and endDate
  const filteredSummary = salesSummary.filter((item) => {
    const monthStart = dayjs(item.month, 'YYYY-MM').startOf('month')
    const monthEnd = dayjs(item.month, 'YYYY-MM').endOf('month')
    return (
      monthStart.isSameOrAfter(dayjs(startDate)) &&
      monthEnd.isSameOrBefore(dayjs(endDate))
    )
  })

  // Prepare chart labels (months)
  const labels = filteredSummary.map((item) => item.month)
  const sortedFormats = useMemo(
    () => getTopSellingFormats(filteredSummary),
    [filteredSummary]
  )

  useEffect(() => setActiveFormats(sortedFormats), [])

  // Toggle format visibility
  const toggleFormat = (format: string) => {
    setActiveFormats((prevActiveFormats) =>
      prevActiveFormats.includes(format)
        ? prevActiveFormats.filter((f) => f !== format)
        : [...prevActiveFormats, format]
    )
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // Prepare data for vendor cut by format, stacked by format
    const formatDetails = Array.from(new Set([...sortedFormats, 'Other'])).map(
      (format, index) => ({
        label: format,
        data: filteredSummary.map((item) =>
          format === 'Other'
            ? Object.entries(item.formatDetails).reduce((sum, [fmt, data]) => {
                if (!sortedFormats.includes(fmt)) {
                  return sum + data.totalVendorCut
                }
                return sum
              }, 0)
            : item.formatDetails[format]?.totalVendorCut || 0
        ),
        stack: 'Stack 1',
        backgroundColor:
          format === 'Other'
            ? '#b3b3b3'
            : coloursQual[index % coloursQual.length],
        hidden: !activeFormats.includes(format),
      })
    )

    if (chartRef.current) {
      // If the chart exists, update datasets and visibility
      formatDetails.forEach((dataset, index) => {
        const existingDataset = chartRef.current!.data.datasets[index]
        if (existingDataset) {
          existingDataset.hidden = dataset.hidden
        } else {
          chartRef.current!.data.datasets.push(dataset)
        }
      })
      chartRef.current.update()
    } else {
      // Otherwise, create a new chart
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: formatDetails,
        },
        options: {
          responsive: true,
          animation: false, // Disable the opening animation
          plugins: {
            legend: {
              display: false,
              position: 'top',
            },
            title: {
              display: false,
              text: 'Monthly Vendor Cuts by Format',
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const label = tooltipItem.dataset.label || ''
                  const value = tooltipItem.raw as number
                  return `${label}: $${value.toFixed(2)}`
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              title: {
                display: true,
                text: 'Vendor Cut in $NZD', // Add y-axis label
              },
              ticks: {
                callback: (value) => `$${value}`,
              },
            },
          },
        },
      })
    }

    // Cleanup on component unmount
    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [filteredSummary, startDate, endDate, activeFormats, sortedFormats])

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {sortedFormats.map((format, index) => (
          <button
            key={format}
            className={`px-3 py-1 rounded-full font-bold text-xs hover:opacity-80 hover:shadow-md`}
            onClick={() => toggleFormat(format)}
            style={{
              backgroundColor: activeFormats.includes(format)
                ? coloursQual[index % coloursQual.length]
                : '#c0c0c0',
            }}
          >
            {format}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default SalesChart
