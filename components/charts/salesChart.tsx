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
import { useEffect, useRef } from 'react'

// Register necessary Chart.js components
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
}

const SalesChart = ({ salesSummary }: SalesChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)

  // Prepare chart labels (months)
  const labels = salesSummary.map((item) => item.month)

  // Prepare format colours
  const colours = [
    '#66c2a5',
    '#fc8d62',
    '#8da0cb',
    '#e78ac3',
    '#a6d854',
    '#ffd92f',
  ]

  // Prepare data for vendor cut by format, stacked by format
  const formats = new Set<string>()
  salesSummary.forEach((item) => {
    Object.keys(item.formatDetails).forEach((format) => formats.add(format))
  })

  const formatDetails = Array.from(formats).map((format, index) => ({
    label: format,
    data: salesSummary.map(
      (item) => item.formatDetails[format]?.totalVendorCut || 0
    ),
    stack: 'Stack 1',
    backgroundColor: colours[index % colours.length], // Use the provided colours
  }))

  // Process formats to ensure "Other" is last and on top
  const sortedFormats = formatDetails.sort((a, b) =>
    a.label === 'Other' ? 1 : -1
  )

  // Ensure "Other" format is added last
  if (formats.size > 5) {
    const otherFormat = sortedFormats.find((format) => format.label === 'Other')
    const topFormats = sortedFormats.filter(
      (format) => format.label !== 'Other'
    )
    sortedFormats.length = 0 // Clear the array
    sortedFormats.push(...topFormats, otherFormat) // Add top formats first, then "Other"
  }

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d')

    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: sortedFormats,
        },
        options: {
          responsive: true,
          animation: false, // Disable the opening animation
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
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
                callback: (value) => {
                  return `$${value}`
                },
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
  }, [salesSummary]) // Add salesSummary as a dependency

  return <canvas ref={chartRef} />
}

export default SalesChart
