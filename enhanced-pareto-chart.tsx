"use client"

import { useState } from "react"
import {
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LabelList,
  ReferenceLine,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings, X, TrendingUp, BarChart3, Target } from "lucide-react"

const safeNumber = (value: string | number | undefined, fallback: number) => {
  const n = typeof value === "number" ? value : Number.parseInt(value || "")
  return Number.isNaN(n) ? fallback : n
}

interface DataItem {
  category: string
  count: number
}

interface ChartConfig {
  title: string
  description: string
  data: DataItem[]
  selectedDevice: string
  selectedSensor: string
  timezone: string
  refreshInterval: string
  dateRange: string
  chartHeight: string
  colorScheme: string
  showGrid: boolean
  showTooltip: boolean
  showLegend: boolean
  fontSize: string
  fontFamily: string
  barColor: string
  lineColor: string
  backgroundColor: string
  borderColor: string
  borderRadius: string
  yAxisLabelFontColor: string
  yAxisTextColor: string
  xAxisLabelFontColor: string
  xAxisTextColor: string
  yAxisColor: string
  xAxisColor: string
  titleFontSize: string
  titleFontWeight: string
  titleFontColor: string
  gridLineColor: string
  width: string
  height: string
  chartFontStyle: string
  legendTextColor: string
}

interface ParetoChartProps {
  config: ChartConfig
}

export default function EnhancedParetoChart({ config }: ParetoChartProps) {
  const [chartSettings, setChartSettings] = useState({
    showLegend: true,
    showLabels: true,
    showTooltip: true,
    showDataLabels: true,
    enableDrillDown: false,
    showGrid: true,
    showThresholdLine: true,
    enableAnimation: true,
    showGradient: true,
  })

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  // Sort data by count in descending order
  const sortedData = [...config.data].sort((a, b) => b.count - a.count)

  // Calculate cumulative percentages
  const total = sortedData.reduce((sum, item) => sum + item.count, 0)
  let cumulative = 0

  const chartData = sortedData.map((item) => {
    cumulative += item.count
    const cumulativePercentage = (cumulative / total) * 100
    return {
      ...item,
      cumulativePercentage: Math.round(cumulativePercentage * 10) / 10,
      percentage: Math.round((item.count / total) * 1000) / 10,
    }
  })

  const colors = {
    primary: config.barColor || "#3B82F6",
    secondary: config.lineColor || "#EF4444",
    primaryGradient: `url(#barGradient)`,
    threshold: "#F59E0B",
  }

  const chartConfig = {
    count: {
      label: "Count",
      color: colors.primary,
    },
    cumulativePercentage: {
      label: "Cumulative %",
      color: colors.secondary,
    },
  }

  const chartHeightPx = safeNumber(config.height, 600)

  // Enhanced Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0 && chartSettings.showTooltip) {
      const data = payload[0]?.payload
      return (
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-5 min-w-[280px] z-50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <p className="font-bold text-gray-900 text-lg">{label}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Count</span>
              </div>
              <span className="font-bold text-blue-600 text-lg">{data?.count?.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700">Cumulative</span>
              </div>
              <span className="font-bold text-red-600 text-lg">{data?.cumulativePercentage}%</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Individual</span>
              </div>
              <span className="font-bold text-green-600 text-lg">{data?.percentage}%</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${data?.cumulativePercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">Progress towards 80% threshold</p>
          </div>
        </div>
      )
    }
    return null
  }

  // Custom label component for bars with enhanced styling
  const BarLabel = ({ x, y, width, value }: any) => {
    if (value === undefined || value === null || Number.isNaN(value)) return null

    const labelText = typeof value === "number" ? value.toLocaleString() : `${value}`

    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill={config.yAxisTextColor || "#1F2937"}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fontFamily={config.chartFontStyle || "Inter"}
        className="drop-shadow-sm"
      >
        {labelText}
      </text>
    )
  }

  // Custom label component for line points with enhanced styling
  const LineLabel = ({ x, y, value }: any) => {
    if (value === undefined || value === null || Number.isNaN(value)) return null

    return (
      <g>
        <circle
          cx={x}
          cy={y - 15}
          r="12"
          fill="white"
          stroke={colors.secondary}
          strokeWidth="2"
          className="drop-shadow-md"
        />
        <text
          x={x}
          y={y - 11}
          fill={colors.secondary}
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fontFamily={config.chartFontStyle || "Inter"}
        >
          {`${value}%`}
        </text>
      </g>
    )
  }

  const handleBarClick = (data: any) => {
    if (chartSettings.enableDrillDown) {
      console.log("Drill down clicked for:", data)
      alert(`Drill down for: ${data.category} (Count: ${data.count})`)
    }
  }

  const updateSetting = (key: keyof typeof chartSettings, value: boolean) => {
    setChartSettings((prev) => ({ ...prev, [key]: value }))
  }

  // Show message if no data is available
  if (!config.data || config.data.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <Card
          className="shadow-2xl border-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
          style={{
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
            borderRadius: `${config.borderRadius}px`,
          }}
        >
          <CardHeader className="pb-4">
            <CardTitle
              className="flex items-center gap-3"
              style={{
                fontFamily: config.fontFamily,
                fontSize: `${safeNumber(config.titleFontSize, 24)}px`,
                color: config.titleFontColor,
                fontWeight:
                  config.titleFontWeight === "Bold" ? "bold" : config.titleFontWeight === "Light" ? "300" : "normal",
              }}
            >
              <BarChart3 className="w-8 h-8 text-blue-600" />
              {config.title}
            </CardTitle>
            <CardDescription className="text-lg" style={{ fontFamily: config.fontFamily }}>
              {config.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border-2 border-dashed border-blue-300">
              <div className="text-center max-w-md">
                <div className="text-8xl mb-8 animate-pulse">📊</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Ready to Analyze Data</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Your enhanced Pareto chart is configured and ready to display data with beautiful visualizations and
                  interactive features.
                </p>

                {config.selectedDevice && config.selectedSensor ? (
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-lg font-bold text-green-700">Configuration Complete</span>
                    </div>
                    <div className="space-y-3 text-base text-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Device:</span>
                        <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                          {config.selectedDevice}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Sensor:</span>
                        <span className="px-3 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                          {config.selectedSensor.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <p className="text-amber-800 text-base">
                      <strong>Configuration Needed:</strong>
                      <br />
                      Please select a device and sensor in the Data Configuration tab to complete setup.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 overflow-hidden">
        <CardHeader className="relative bg-gradient-to-r from-slate-800 to-slate-700 text-white">
          <CardTitle
            className="flex items-center gap-3 text-white"
            style={{
              fontFamily: config.fontFamily,
              fontSize: `${safeNumber(config.titleFontSize, 24)}px`,
              fontWeight:
                config.titleFontWeight === "Bold" ? "bold" : config.titleFontWeight === "Light" ? "300" : "normal",
            }}
          >
            <BarChart3 className="w-8 h-8" />
            {config.title}
          </CardTitle>
          <CardDescription className="text-slate-200 text-lg" style={{ fontFamily: config.fontFamily }}>
            {config.description}
            {config.selectedDevice && config.selectedSensor && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-100 rounded-full text-sm font-medium">
                  📡 {config.selectedDevice}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-100 rounded-full text-sm font-medium">
                  🔧 {config.selectedSensor.replace("-", " ")}
                </span>
              </div>
            )}
          </CardDescription>

          {/* Enhanced Chart Settings Button */}
          <div className="absolute top-6 right-6">
            <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-10 w-10 p-0 bg-white/10 hover:bg-white/20 border-white/20"
                >
                  <Settings className="h-5 w-5 text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-6 bg-white/95 backdrop-blur-sm" align="end">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-xl text-gray-800">Chart Settings</h4>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsSettingsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="legend" className="text-base font-semibold">
                      Show Legend
                    </Label>
                    <Switch
                      id="legend"
                      checked={chartSettings.showLegend}
                      onCheckedChange={(checked) => updateSetting("showLegend", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="dataLabels" className="text-base font-semibold">
                      Show Data Labels
                    </Label>
                    <Switch
                      id="dataLabels"
                      checked={chartSettings.showDataLabels}
                      onCheckedChange={(checked) => updateSetting("showDataLabels", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid" className="text-base font-semibold">
                      Show Grid Lines
                    </Label>
                    <Switch
                      id="grid"
                      checked={chartSettings.showGrid}
                      onCheckedChange={(checked) => updateSetting("showGrid", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="threshold" className="text-base font-semibold">
                      Show 80% Threshold Line
                    </Label>
                    <Switch
                      id="threshold"
                      checked={chartSettings.showThresholdLine}
                      onCheckedChange={(checked) => updateSetting("showThresholdLine", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="gradient" className="text-base font-semibold">
                      Gradient Effects
                    </Label>
                    <Switch
                      id="gradient"
                      checked={chartSettings.showGradient}
                      onCheckedChange={(checked) => updateSetting("showGradient", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="animation" className="text-base font-semibold">
                      Enable Animations
                    </Label>
                    <Switch
                      id="animation"
                      checked={chartSettings.enableAnimation}
                      onCheckedChange={(checked) => updateSetting("enableAnimation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="drilldown" className="text-base font-semibold">
                      Enable Drill Down
                    </Label>
                    <Switch
                      id="drilldown"
                      checked={chartSettings.enableDrillDown}
                      onCheckedChange={(checked) => updateSetting("enableDrillDown", checked)}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <ChartContainer config={chartConfig} style={{ height: `${chartHeightPx}px`, width: "100%" }}>
              <ResponsiveContainer width="100%" height={chartHeightPx}>
                <ComposedChart
                  data={chartData}
                  margin={{
                    top: 60,
                    right: 80,
                    left: 80,
                    bottom: chartSettings.showLegend ? 180 : 160,
                  }}
                  onMouseEnter={(data) => setHoveredBar(data?.activeLabel || null)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors.primary} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={colors.primary} stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={colors.secondary} stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.8} />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.1" />
                    </filter>
                  </defs>

                  {chartSettings.showGrid && (
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={config.gridLineColor || "#E5E7EB"}
                      strokeOpacity={0.6}
                      strokeWidth={1}
                    />
                  )}

                  <XAxis
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    height={140}
                    interval={0}
                    tick={{
                      fontSize: safeNumber(config.fontSize || "14", 14),
                      fontFamily: config.chartFontStyle || "Inter",
                      fontWeight: 600,
                      fill: config.xAxisTextColor || "#374151",
                    }}
                    axisLine={{
                      stroke: config.xAxisColor || "#D1D5DB",
                      strokeWidth: 2,
                    }}
                    tickLine={{
                      stroke: config.xAxisColor || "#D1D5DB",
                      strokeWidth: 1,
                    }}
                    label={
                      chartSettings.showLabels
                        ? {
                            value: "Issue Categories",
                            position: "insideBottom",
                            offset: -10,
                            style: {
                              textAnchor: "middle",
                              fontSize: `${safeNumber(config.fontSize || "14", 14) + 4}px`,
                              fontWeight: "700",
                              fontFamily: config.chartFontStyle || "Inter",
                              fill: config.xAxisLabelFontColor || "#1F2937",
                            },
                          }
                        : undefined
                    }
                  />

                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{
                      fontSize: safeNumber(config.fontSize || "14", 14),
                      fontFamily: config.chartFontStyle || "Inter",
                      fontWeight: 600,
                      fill: config.yAxisTextColor || "#374151",
                    }}
                    axisLine={{
                      stroke: config.yAxisColor || "#D1D5DB",
                      strokeWidth: 2,
                    }}
                    tickLine={{
                      stroke: config.yAxisColor || "#D1D5DB",
                      strokeWidth: 1,
                    }}
                    label={
                      chartSettings.showLabels
                        ? {
                            value: "Frequency Count",
                            angle: -90,
                            position: "insideLeft",
                            style: {
                              textAnchor: "middle",
                              fontSize: `${safeNumber(config.fontSize || "14", 14) + 4}px`,
                              fontWeight: "700",
                              fontFamily: config.chartFontStyle || "Inter",
                              fill: config.yAxisLabelFontColor || "#1F2937",
                            },
                          }
                        : undefined
                    }
                  />

                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    tick={{
                      fontSize: safeNumber(config.fontSize || "14", 14),
                      fontFamily: config.chartFontStyle || "Inter",
                      fontWeight: 600,
                      fill: config.yAxisTextColor || "#374151",
                    }}
                    axisLine={{
                      stroke: config.yAxisColor || "#D1D5DB",
                      strokeWidth: 2,
                    }}
                    tickLine={{
                      stroke: config.yAxisColor || "#D1D5DB",
                      strokeWidth: 1,
                    }}
                    label={
                      chartSettings.showLabels
                        ? {
                            value: "Cumulative Percentage (%)",
                            angle: 90,
                            position: "insideRight",
                            style: {
                              textAnchor: "middle",
                              fontSize: `${safeNumber(config.fontSize || "14", 14) + 4}px`,
                              fontWeight: "700",
                              fontFamily: config.chartFontStyle || "Inter",
                              fill: config.yAxisLabelFontColor || "#1F2937",
                            },
                          }
                        : undefined
                    }
                  />

                  {/* Enhanced Tooltip */}
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      fill: "rgba(59, 130, 246, 0.1)",
                      stroke: "rgba(59, 130, 246, 0.3)",
                      strokeWidth: 2,
                      strokeDasharray: "5 5",
                    }}
                    animationDuration={chartSettings.enableAnimation ? 200 : 0}
                  />

                  {/* 80% Threshold Line */}
                  {chartSettings.showThresholdLine && (
                    <ReferenceLine
                      yAxisId="right"
                      y={80}
                      stroke={colors.threshold}
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      label={{
                        value: "80% Threshold",
                        position: "topRight",
                        style: {
                          fontSize: "14px",
                          fontWeight: "700",
                          fill: colors.threshold,
                          fontFamily: config.chartFontStyle || "Inter",
                        },
                      }}
                    />
                  )}

                  <Bar
                    yAxisId="left"
                    dataKey="count"
                    fill={chartSettings.showGradient ? colors.primaryGradient : colors.primary}
                    name="Count"
                    stroke={colors.primary}
                    strokeWidth={2}
                    cursor={chartSettings.enableDrillDown ? "pointer" : "default"}
                    onClick={handleBarClick}
                    radius={[4, 4, 0, 0]}
                    filter="url(#shadow)"
                    animationDuration={chartSettings.enableAnimation ? 1000 : 0}
                    animationBegin={0}
                  >
                    {chartSettings.showDataLabels && <LabelList content={<BarLabel />} />}
                  </Bar>

                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumulativePercentage"
                    stroke="url(#lineGradient)"
                    strokeWidth={4}
                    dot={{
                      fill: colors.secondary,
                      strokeWidth: 3,
                      r: 6,
                      stroke: "#FFFFFF",
                      filter: "url(#shadow)",
                    }}
                    activeDot={{
                      r: 8,
                      fill: colors.secondary,
                      stroke: "#FFFFFF",
                      strokeWidth: 3,
                      filter: "url(#shadow)",
                    }}
                    name="Cumulative %"
                    animationDuration={chartSettings.enableAnimation ? 1500 : 0}
                    animationBegin={chartSettings.enableAnimation ? 500 : 0}
                  >
                    {chartSettings.showDataLabels && <LabelList content={<LineLabel />} />}
                  </Line>

                  {/* Enhanced Legend */}
                  {chartSettings.showLegend && (
                    <Legend
                      verticalAlign="bottom"
                      height={50}
                      iconType="rect"
                      wrapperStyle={{
                        paddingTop: "30px",
                        fontSize: `${safeNumber(config.fontSize || "14", 16)}px`,
                        fontFamily: config.chartFontStyle || "Inter",
                        fontWeight: "600",
                        color: config.legendTextColor || "#1F2937",
                      }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Enhanced Summary Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <h4 className="font-bold text-lg text-blue-900">Total Issues</h4>
              </div>
              <p className="text-3xl font-bold text-blue-700">{total.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-2">From {config.selectedDevice || "selected device"}</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-8 h-8 text-red-600" />
                <h4 className="font-bold text-lg text-red-900">Top 3 Impact</h4>
              </div>
              <p className="text-3xl font-bold text-red-700">
                {Math.round((chartData[2]?.cumulativePercentage || 0) * 10) / 10}%
              </p>
              <p className="text-sm text-red-600 mt-2">of total issues</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-8 h-8 text-green-600" />
                <h4 className="font-bold text-lg text-green-900">Critical Items</h4>
              </div>
              <p className="text-3xl font-bold text-green-700">
                {chartData.filter((item) => item.cumulativePercentage <= 80).length}
              </p>
              <p className="text-sm text-green-600 mt-2">within 80% threshold</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Settings className="w-8 h-8 text-purple-600" />
                <h4 className="font-bold text-lg text-purple-900">Data Source</h4>
              </div>
              <p className="text-sm text-purple-700 font-semibold">
                <strong>Device:</strong> {config.selectedDevice || "Not selected"}
              </p>
              <p className="text-sm text-purple-700 font-semibold mt-1">
                <strong>Sensor:</strong> {config.selectedSensor?.replace("-", " ") || "Not selected"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
