import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useEffect, useRef } from 'react'
import { getRandomColor } from '@/lib/data-functions'

// Register the necessary components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
)

const SalesAndPaymentsByMonthChart = ({ paymentSummary, salesSummary }) => {
  // Prepare chart labels (months)
  const labels = paymentSummary.map((item) => item.month)

  // Prepare data for total payments
  // const totalPaymentsData = paymentSummary.map((item) => item.totalAmount)

  // Prepare data for vendor cut by format, stacked by format
  const formats = new Set()
  salesSummary.forEach((item) => {
    Object.keys(item.formatDetails).forEach((format) => formats.add(format))
  })

  const formatDataSets = Array.from(formats).map((format) => {
    return {
      label: `${format}`,
      data: salesSummary.map(
        (item) => item.formatDetails[format]?.totalVendorCut || 0
      ),
      // stack: 'Stack 1',
      backgroundColor: getRandomColor(),
    }
  })

  const chartRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d')

    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: formatDataSets,
          // datasets: [
          //   {
          //     label: 'Total Payments',
          //     data: totalPaymentsData,
          //     backgroundColor: 'rgba(54, 162, 235, 0.7)',
          //     borderColor: 'rgba(54, 162, 235, 1)',
          //     borderWidth: 1,
          //     type: 'bar',
          //   },
          //   ...formatDataSets,
          // ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Monthly Vendor Income by Format',
            },
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
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
  }, [])

  return <canvas ref={chartRef} />
}

export default SalesAndPaymentsByMonthChart
