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
import { useEffect, useRef } from 'react'

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
  const chartRef = useRef<HTMLCanvasElement | null>(null)

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

  // Prepare format colours
  const colours = [
    '#66c2a5',
    '#fc8d62',
    '#8da0cb',
    '#e78ac3',
    '#a6d854',
    '#ffd92f',
    '#e5c494',
    '#b3b3b3',
    '#ff69b4',
  ]

  // Collect all formats and their total vendor cuts
  const formatTotals: Record<string, number> = {}

  filteredSummary.forEach((item) => {
    Object.entries(item.formatDetails).forEach(([format, data]) => {
      if (!formatTotals[format]) {
        formatTotals[format] = 0
      }
      formatTotals[format] += data.totalVendorCut
    })
  })

  // Determine top formats by total vendor cut
  const sortedFormats = Object.entries(formatTotals)
    .sort((a, b) => b[1] - a[1]) // Sort by total vendor cut in descending order
    .slice(0, 8) // Get top 8 formats
    .map(([format]) => format)

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
        format === 'Other' ? '#b3b3b3' : colours[index % colours.length],
    })
  )

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d')

    if (ctx) {
      new Chart(ctx, {
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
      if (ctx) {
        Chart.getChart(ctx)?.destroy()
      }
    }
  }, [filteredSummary, startDate, endDate]) // Add filteredSummary, startDate, and endDate as dependencies

  return <canvas ref={chartRef} />
}

export default SalesChart
