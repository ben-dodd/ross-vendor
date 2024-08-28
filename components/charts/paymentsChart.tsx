import { PaymentMonthlySummary } from '@/lib/types'
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
// import zoomPlugin from 'chartjs-plugin-zoom'
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
  // zoomPlugin
)

type PaymentsChartProps = {
  paymentSummary: PaymentMonthlySummary[]
}

const PaymentsChart = ({ paymentSummary }: PaymentsChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)

  // Prepare chart labels (months)
  const labels = paymentSummary.map((item) => item.month)

  // Prepare data for total payments
  const totalPaymentsData = paymentSummary.map((item) => item.totalAmount / 100) // Convert cents to dollars

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d')

    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Payments',
              data: totalPaymentsData,
              backgroundColor: '#66c2a5', // Single color for the bar
            },
          ],
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
              text: 'Monthly Total Payments',
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
            zoom: {
              zoom: {
                wheel: {
                  enabled: true, // Enable zooming with mouse wheel
                },
                pinch: {
                  enabled: true, // Enable zooming with pinch gestures
                },
                mode: 'x', // Zoom in both x and y axes
              },
              pan: {
                enabled: true, // Enable panning
                mode: 'x', // Pan in both x and y axes
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Total Payments in $NZD', // Add y-axis label
              },
              ticks: {
                callback: (value) => {
                  return `$${value.toFixed(0)}` // Convert to dollars and format
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
  }, [paymentSummary]) // Add paymentSummary as a dependency

  return <canvas ref={chartRef} />
}

export default PaymentsChart
