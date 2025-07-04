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
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings, X } from "lucide-react"

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

export default function ParetoChart({ config }: ParetoChartProps) {
  const [chartSettings, setChartSettings] = useState({
    showLegend: true,
    showLabels: true,
    showTooltip: true,
    showDataLabels: true,
    enableDrillDown: false,
    showGrid: true,
    showThresholdLine: true, // Default to true to show 80% line
  })

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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
    }
  })

  console.log("Chart Data:", chartData)
  console.log("Config Data:", config.data)
  console.log("Selected Device:", config.selectedDevice)
  console.log("Selected Sensor:", config.selectedSensor)

  const colors = {
    primary: config.barColor || "#3b82f6",
    secondary: config.lineColor || "#1d4ed8",
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

  const chartHeightPx = safeNumber(config.height, 500)

  // Enhanced Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0 && chartSettings.showTooltip) {
      const countData = payload.find((p: any) => p.dataKey === "count")
      const percentData = payload.find((p: any) => p.dataKey === "cumulativePercentage")

      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-4 min-w-[220px] z-50">
          <p className="font-bold text-gray-900 mb-3 text-base border-b pb-2">{label}</p>

          {countData && (
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: countData.color }} />
                <span className="text-sm font-medium text-gray-700">Count</span>
              </div>
              <span className="font-bold text-gray-900">{countData.value.toLocaleString()}</span>
            </div>
          )}

          {percentData && (
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: percentData.color }} />
                <span className="text-sm font-medium text-gray-700">Cumulative %</span>
              </div>
              <span className="font-bold text-gray-900">{percentData.value}%</span>
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-600">
              Individual: {(((countData?.value || 0) / total) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Custom label component for bars
  const BarLabel = ({ x, y, width, value }: any) => {
    if (value === undefined || value === null || Number.isNaN(value)) return null

    const labelText = typeof value === "number" ? value.toLocaleString() : `${value}`

    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill={config.yAxisTextColor || "#374151"}
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fontFamily={config.chartFontStyle || "Noto Sans"}
      >
        {labelText}
      </text>
    )
  }

  // Custom label component for line points
  const LineLabel = ({ x, y, value }: any) => {
    if (value === undefined || value === null || Number.isNaN(value)) return null

    return (
      <text
        x={x}
        y={y - 10}
        fill={config.yAxisTextColor || "#374151"}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fontFamily={config.chartFontStyle || "Noto Sans"}
      >
        {`${value}%`}
      </text>
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
      <div className="w-full max-w-5xl mx-auto p-6">
        <Card
          style={{
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
            borderRadius: `${config.borderRadius}px`,
          }}
        >
          <CardHeader>
            <CardTitle
              style={{
                fontFamily: config.fontFamily,
                fontSize: `${safeNumber(config.titleFontSize, 20)}px`,
                color: config.titleFontColor,
                fontWeight:
                  config.titleFontWeight === "Bold" ? "bold" : config.titleFontWeight === "Light" ? "300" : "normal",
              }}
            >
              {config.title}
            </CardTitle>
            <CardDescription style={{ fontFamily: config.fontFamily }}>{config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-dashed border-blue-300">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-6">📊</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Analyze Data</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Your Pareto chart is configured and ready to display data. Connect your data source to see powerful
                  insights about the vital few factors that drive most of your issues.
                </p>

                {config.selectedDevice && config.selectedSensor ? (
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-green-700">Configuration Complete</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Device:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {config.selectedDevice}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Sensor:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {config.selectedSensor.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                      <p className="text-xs text-blue-700">
                        <strong>Next Step:</strong> Connect your data source to populate this chart with real-time
                        Pareto analysis
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-amber-800 text-sm">
                      <strong>Configuration Needed:</strong>
                      <br />
                      Please select a device and sensor in the Data Configuration tab to complete setup.
                    </p>
                  </div>
                )}

                <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>80/20 Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Real-time Updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Interactive Charts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Drill-down Capable</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <Card
        style={{
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          borderRadius: `${config.borderRadius}px`,
        }}
      >
        <CardHeader className="relative">
          <CardTitle
            style={{
              fontFamily: config.fontFamily,
              fontSize: `${safeNumber(config.titleFontSize, 20)}px`,
              color: config.titleFontColor,
              fontWeight:
                config.titleFontWeight === "Bold" ? "bold" : config.titleFontWeight === "Light" ? "300" : "normal",
            }}
          >
            {config.title}
          </CardTitle>
          <CardDescription style={{ fontFamily: config.fontFamily }}>
            {config.description}
            {config.selectedDevice && config.selectedSensor && (
              <div className="mt-2 text-sm">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  📡 {config.selectedDevice}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs ml-2">
                  🔧 {config.selectedSensor.replace("-", " ")}
                </span>
              </div>
            )}
          </CardDescription>

          {/* Chart Settings Button */}
          <div className="absolute top-4 right-4">
            <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg">Chart Settings</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsSettingsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="legend" className="text-sm font-medium">
                      Show Legend
                    </Label>
                    <Switch
                      id="legend"
                      checked={chartSettings.showLegend}
                      onCheckedChange={(checked) => updateSetting("showLegend", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="labels" className="text-sm font-medium">
                      Show Axis Labels
                    </Label>
                    <Switch
                      id="labels"
                      checked={chartSettings.showLabels}
                      onCheckedChange={(checked) => updateSetting("showLabels", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="dataLabels" className="text-sm font-medium">
                      Show Data Labels
                    </Label>
                    <Switch
                      id="dataLabels"
                      checked={chartSettings.showDataLabels}
                      onCheckedChange={(checked) => updateSetting("showDataLabels", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="tooltip" className="text-sm font-medium">
                      Show Tooltip
                    </Label>
                    <Switch
                      id="tooltip"
                      checked={chartSettings.showTooltip}
                      onCheckedChange={(checked) => updateSetting("showTooltip", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid" className="text-sm font-medium">
                      Show Grid Lines
                    </Label>
                    <Switch
                      id="grid"
                      checked={chartSettings.showGrid}
                      onCheckedChange={(checked) => updateSetting("showGrid", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="threshold" className="text-sm font-medium">
                      Show 80% Threshold Line
                    </Label>
                    <Switch
                      id="threshold"
                      checked={chartSettings.showThresholdLine}
                      onCheckedChange={(checked) => updateSetting("showThresholdLine", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="drilldown" className="text-sm font-medium">
                      Enable Drill Down
                    </Label>
                    <Switch
                      id="drilldown"
                      checked={chartSettings.enableDrillDown}
                      onCheckedChange={(checked) => updateSetting("enableDrillDown", checked)}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    {chartSettings.enableDrillDown && "Click on bars to drill down into details"}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfig} style={{ height: `${chartHeightPx}px`, width: "100%" }}>
            <ResponsiveContainer width="100%" height={chartHeightPx}>
              <ComposedChart
                data={chartData}
                margin={{
                  top: 60,
                  right: 100,
                  left: 80,
                  bottom: chartSettings.showLegend ? 180 : 160,
                }}
              >
                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.primary} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={colors.primary} stopOpacity={0.7} />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1" />
                  </filter>
                </defs>

                {chartSettings.showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={config.gridLineColor || "#E5E7EB"}
                    strokeOpacity={0.4}
                    strokeWidth={1}
                  />
                )}

                {/* X-Axis for Categories */}
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={140}
                  interval={0}
                  tick={{
                    fontSize: safeNumber(config.fontSize || "12", 12),
                    fontFamily: config.chartFontStyle || "Inter",
                    fontWeight: 500,
                    fill: config.xAxisTextColor || "#374151",
                  }}
                  axisLine={{
                    stroke: config.xAxisColor || "#D1D5DB",
                    strokeWidth: 1,
                  }}
                  tickLine={{
                    stroke: config.xAxisColor || "#D1D5DB",
                    strokeWidth: 1,
                  }}
                />

                {/* Left Y-Axis for Count Values */}
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  domain={[0, "dataMax"]}
                  tick={{
                    fontSize: safeNumber(config.fontSize || "12", 12),
                    fontFamily: config.chartFontStyle || "Inter",
                    fontWeight: 500,
                    fill: config.yAxisTextColor || "#374151",
                  }}
                  axisLine={{
                    stroke: config.yAxisColor || "#D1D5DB",
                    strokeWidth: 1,
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
                            fontSize: `${safeNumber(config.fontSize || "12", 12) + 2}px`,
                            fontWeight: "600",
                            fontFamily: config.chartFontStyle || "Inter",
                            fill: config.yAxisLabelFontColor || "#1F2937",
                          },
                        }
                      : undefined
                  }
                />

                {/* Right Y-Axis for Cumulative Percentage */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{
                    fontSize: safeNumber(config.fontSize || "12", 12),
                    fontFamily: config.chartFontStyle || "Inter",
                    fontWeight: 500,
                    fill: config.yAxisTextColor || "#374151",
                  }}
                  axisLine={{
                    stroke: config.yAxisColor || "#D1D5DB",
                    strokeWidth: 1,
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
                            fontSize: `${safeNumber(config.fontSize || "12", 12) + 2}px`,
                            fontWeight: "600",
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
                    fill: "rgba(59, 130, 246, 0.08)",
                    stroke: "rgba(59, 130, 246, 0.2)",
                    strokeWidth: 1,
                  }}
                  animationDuration={150}
                />

                {/* 80% Threshold Reference Line */}
                {chartSettings.showThresholdLine && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey={() => 80}
                    stroke="#F59E0B"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    dot={false}
                    name="80% Threshold"
                    connectNulls={false}
                  />
                )}

                {/* Bars for Frequency Count */}
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  fill={colors.primary}
                  name="Frequency Count"
                  stroke={colors.primary}
                  strokeWidth={1}
                  cursor={chartSettings.enableDrillDown ? "pointer" : "default"}
                  onClick={handleBarClick}
                  radius={[2, 2, 0, 0]}
                  maxBarSize={60}
                >
                  {chartSettings.showDataLabels && (
                    <LabelList
                      dataKey="count"
                      position="top"
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        fill: config.yAxisTextColor || "#374151",
                        fontFamily: config.chartFontStyle || "Inter",
                      }}
                      formatter={(value: number) => value.toLocaleString()}
                    />
                  )}
                </Bar>

                {/* Line for Cumulative Percentage */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulativePercentage"
                  stroke={colors.secondary}
                  strokeWidth={3}
                  dot={{
                    fill: colors.secondary,
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#FFFFFF",
                  }}
                  activeDot={{
                    r: 6,
                    fill: colors.secondary,
                    stroke: "#FFFFFF",
                    strokeWidth: 2,
                  }}
                  name="Cumulative %"
                  connectNulls={true}
                >
                  {chartSettings.showDataLabels && (
                    <LabelList
                      dataKey="cumulativePercentage"
                      position="top"
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        fill: colors.secondary,
                        fontFamily: config.chartFontStyle || "Inter",
                      }}
                      formatter={(value: number) => `${value}%`}
                    />
                  )}
                </Line>

                {/* Enhanced Legend */}
                {chartSettings.showLegend && (
                  <Legend
                    verticalAlign="bottom"
                    height={40}
                    iconType="rect"
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: `${safeNumber(config.fontSize || "12", 12) + 2}px`,
                      fontFamily: config.chartFontStyle || "Inter",
                      fontWeight: "500",
                      color: config.legendTextColor || "#1F2937",
                    }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Total Issues</h4>
              <p className="text-2xl font-bold text-chart-1">{total.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">From {config.selectedDevice || "selected device"}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Top 3 Categories</h4>
              <p className="text-lg font-semibold text-chart-2">
                {Math.round((chartData[2]?.cumulativePercentage || 0) * 10) / 10}%
              </p>
              <p className="text-xs text-muted-foreground">of total issues</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Data Source</h4>
              <p className="text-xs text-muted-foreground">
                <strong>Device:</strong> {config.selectedDevice || "Not selected"}
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Sensor:</strong> {config.selectedSensor?.replace("-", " ") || "Not selected"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
