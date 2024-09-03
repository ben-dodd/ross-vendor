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
import dayjs from 'dayjs'
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

type SalesCumChartProps = {
  salesSummary: SaleMonthlySummary[]
  startDate: string
  endDate: string
}

const SalesCumChart = ({
  salesSummary,
  startDate,
  endDate,
}: SalesCumChartProps) => {
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

  // Ensure filteredSummary includes months before startDate to calculate cumulative data correctly
  const cumulativeData = salesSummary.reduce((acc, item) => {
    const lastValue =
      acc.length > 0 ? acc[acc.length - 1].cumulativeVendorCut : 0
    const lastStoreValue =
      acc.length > 0 ? acc[acc.length - 1].cumulativeStoreCut : 0
    acc.push({
      month: item.month,
      cumulativeVendorCut: lastValue + (item.totalVendorCut || 0),
      cumulativeStoreCut: lastStoreValue + (item.totalStoreCut || 0),
    })
    return acc
  }, [] as { month: string; cumulativeVendorCut: number; cumulativeStoreCut: number }[])

  // Filter cumulative data based on startDate and endDate
  const filteredCumulativeData = cumulativeData.filter((item) => {
    const monthStart = dayjs(item.month, 'YYYY-MM').startOf('month')
    return (
      monthStart.isSameOrAfter(dayjs(startDate)) &&
      monthStart.isSameOrBefore(dayjs(endDate))
    )
  })

  const vendorCutData = filteredCumulativeData.map((d) => d.cumulativeVendorCut)
  const storeCutData = filteredCumulativeData.map((d) => d.cumulativeStoreCut)

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d')

    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: filteredCumulativeData.map((d) => d.month),
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
          animation: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: false, // Hide the title
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
              type: 'category',
              labels: filteredCumulativeData.map((d) => d.month),
            },
            y: {
              title: {
                display: true,
                text: 'Cut in $NZD',
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
  }, [filteredCumulativeData, startDate, endDate]) // Add filteredCumulativeData, startDate, and endDate as dependencies

  return <canvas ref={chartRef} />
}

export default SalesCumChart
