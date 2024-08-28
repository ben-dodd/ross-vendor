import { SaleMonthlySummary } from '@/lib/types'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useEffect, useRef } from 'react'

// Register necessary Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
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
  const labels = salesSummary.map((item) => item.month) // Assume `month` is a string like 'January', 'February', etc.

  // Calculate cumulative vendor cuts
  const cumulativeData = salesSummary.reduce((acc, item) => {
    const lastValue =
      acc.length > 0 ? acc[acc.length - 1].cumulativeVendorCut : 0
    const lastStoreValue =
      acc.length > 0 ? acc[acc.length - 1].cumulativeStoreCut : 0
    acc.push({
      month: item.month,
      cumulativeVendorCut: lastValue + item.totalVendorCut,
      cumulativeStoreCut: lastStoreValue + item.totalStoreCut,
    })
    return acc
  }, [] as { month: string; cumulativeVendorCut: number; cumulativeStoreCut: number }[])

  const vendorCutData = cumulativeData.map((d) => d.cumulativeVendorCut)
  const storeCutData = cumulativeData.map((d) => d.cumulativeStoreCut)

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d')

    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: cumulativeData.map((d) => d.month),
          datasets: [
            {
              label: 'Cumulative Vendor Cut',
              data: vendorCutData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
            {
              label: 'Cumulative Store Cut',
              data: storeCutData,
              borderColor: 'rgba(192, 75, 192, 1)',
              backgroundColor: 'rgba(192, 75, 192, 0.2)',
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Cumulative Vendor and Store Cut Over Time',
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const value = tooltipItem.raw as number
                  return `$${value.toFixed(2)}`
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
              // Set the x-axis type to 'category' for discrete labels
              type: 'category',
              labels: labels, // Use month labels
            },
            y: {
              title: {
                display: true,
                text: 'Vendor Cut in $NZD',
              },
              beginAtZero: true,
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
  }, [salesSummary]) // Add salesSummary as a dependency

  return <canvas ref={chartRef} />
}

export default SalesChart
