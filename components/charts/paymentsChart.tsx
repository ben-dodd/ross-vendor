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
import dayjs from 'dayjs'
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

type PaymentsChartProps = {
  paymentSummary: PaymentMonthlySummary[]
  startDate: string
  endDate: string
}

const PaymentsChart = ({
  paymentSummary,
  startDate,
  endDate,
}: PaymentsChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)

  // Filter paymentSummary based on startDate and endDate
  const filteredSummary = paymentSummary.filter((item) => {
    const monthStart = dayjs(item.month, 'YYYY-MM').startOf('month')
    const monthEnd = dayjs(item.month, 'YYYY-MM').endOf('month')
    return (
      monthStart.isSameOrAfter(dayjs(startDate)) &&
      monthEnd.isSameOrBefore(dayjs(endDate))
    )
  })

  // Prepare chart labels (months)
  const labels = filteredSummary.map((item) => item.month)

  // Prepare data for total payments
  const totalPaymentsData = filteredSummary.map(
    (item) => item.totalAmount / 100
  ) // Convert cents to dollars

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
          animation: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: false,
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
                text: 'Total Payments in $NZD',
              },
              ticks: {
                callback: (value) => `$${value?.toFixed?.(0)}`, // Convert to dollars and format
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
  }, [filteredSummary, startDate, endDate])

  return <canvas ref={chartRef} />
}

export default PaymentsChart
