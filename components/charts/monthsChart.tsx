import { useEffect, useRef } from 'react'
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

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
)

// Helper function to generate labels in the format "Day Hour"
const generateLabels = () => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const labels: string[] = []

  for (const month of months) {
    labels.push(month)
  }

  return labels
}

type SalesMonthChartProps = {
  salesSummary: Record<string, number> // Data grouped by concatenated day and hour
}

const SalesMonthChart = ({ salesSummary }: SalesMonthChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)

  // Generate sorted labels
  const labels = generateLabels()

  // Map sales data to match the generated labels
  const data = labels.map((label) => salesSummary[label] || 0)

  const datasets = [
    {
      label: 'Sales',
      data: data,
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ]

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d')

    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          responsive: true,
          animation: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Sales Breakdown by Month',
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
              title: {
                display: true,
                text: 'Month',
              },
              ticks: {
                // autoSkip: false, // Ensure all labels are displayed
                maxRotation: 90, // Rotate labels to vertical
                minRotation: 90, // Rotate labels to vertical
              },
            },
            y: {
              title: {
                display: true,
                text: 'Sales ($NZD)',
              },
              ticks: {
                callback: (value) => `$${value}`,
              },
            },
          },
        },
      })
    }

    return () => {
      if (ctx) {
        Chart.getChart(ctx)?.destroy()
      }
    }
  }, [salesSummary])

  return <canvas ref={chartRef} />
}

export default SalesMonthChart
