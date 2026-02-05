import type { SalesDataPoint } from '@/lib/api/dashboard'
import { Card } from '@/components/ui/Card'
import { useMemo } from 'react'

interface SalesChartProps {
  data: SalesDataPoint[]
  range: string
  onRangeChange: (range: '30d' | '90d' | 'all') => void
}

export function SalesChart({ data, range, onRangeChange }: SalesChartProps) {
  const maxVal = useMemo(() => Math.max(...data.map((d) => d.revenue), 100), [data])

  // Custom SVG Line Chart
  const svgPoints = useMemo(() => {
    if (data.length < 2) return ''
    const width = 100
    const height = 100

    return data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * width
        const y = height - (d.revenue / maxVal) * height * 0.8 // Use 80% height
        return `${x},${y}`
      })
      .join(' ')
  }, [data, maxVal])

  const fillPoints = useMemo(() => {
    if (svgPoints.length === 0) return ''
    return `0,100 ${svgPoints} 100,100`
  }, [svgPoints])

  return (
    <Card className="p-6 bg-background-card border-white/5 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-white text-lg">Revenue Analytics</h3>
          <p className="text-sm text-text-muted">Income from project sales and royalties</p>
        </div>

        <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
          {(['30d', '90d', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                range === r ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-white'
              }`}
            >
              {r === 'all' ? 'All Time' : r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full relative">
        {/* Y Axis Grid */}
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-text-muted pointer-events-none pb-6 pr-6">
          <span>${maxVal}</span>
          <span>${Math.round(maxVal * 0.5)}</span>
          <span>$0</span>
        </div>

        {/* Chart Area */}
        <div className="absolute inset-0 pl-8 pb-6">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Grid Lines */}
            <line
              x1="0"
              y1="20"
              x2="100"
              y2="20"
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="0.5"
              className="text-white"
            />
            <line
              x1="0"
              y1="60"
              x2="100"
              y2="60"
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="0.5"
              className="text-white"
            />
            <line
              x1="0"
              y1="100"
              x2="100"
              y2="100"
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="0.5"
              className="text-white"
            />

            {/* Gradient Definition */}
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            <polygon points={fillPoints} fill="url(#chartGradient)" />

            {/* Line */}
            <polyline
              points={svgPoints}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* X Axis Labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-text-muted pt-2 opacity-60">
          <span>{data[0]?.date}</span>
          <span>{data[Math.floor(data.length / 2)]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    </Card>
  )
}
