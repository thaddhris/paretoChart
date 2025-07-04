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
import { Settings, X, BarChart3, TrendingUp, Target, AlertTriangle, Download } from "lucide-react"

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
  chartSize: string
  width: string
  height: string
  errorZIndex: string
  wrapIntoCard: boolean
  enableScrollable: boolean
  showSettingIcon: boolean
  showExportIcon: boolean
  showChartTitle: boolean
  advanceSettings: boolean
  chartFontStyle: string
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
  legendTextColor: string
  barColor: string
  lineColor: string
  fontSize: string
}

interface FinalParetoChartProps {
  config: ChartConfig
}

export default function FinalParetoChart({ config }: FinalParetoChartProps) {
  const [chartSettings, setChartSettings] = useState({
    showLegend: true,
    showLabels: true,
    showTooltip: true,
    showDataLabels: true,
    enableDrillDown: true,
    showGrid: true,
    showThresholdLine: true,
    showPercentageLabels: true,
    enableExport: true,
  })

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Sort data by count in descending order (proper Pareto principle)
  const sortedData = [...config.data].sort((a, b) => b.count - a.count)

  // Calculate cumulative percentages properly
  const total = sortedData.reduce((sum, item) => sum + item.count, 0)
  let cumulative = 0

  const chartData = sortedData.map((item, index) => {
    cumulative += item.count
    const cumulativePercentage = (cumulative / total) * 100
    const individualPercentage = (item.count / total) * 100

    return {
      ...item,
      cumulativePercentage: Math.round(cumulativePercentage * 10) / 10,
      individualPercentage: Math.round(individualPercentage * 10) / 10,
      rank: index + 1,
    }
  })

  const colors = {
    primary: config.barColor,
    secondary: config.lineColor,
    threshold: "#F59E0B",
    critical: "#EF4444",
  }

  const chartConfig = {
    count: {
      label: "Frequency Count",
      color: colors.primary,
    },
    cumulativePercentage: {
      label: "Cumulative %",
      color: colors.secondary,
    },
  }

  const chartHeightPx = safeNumber(config.height, 600)

  // Proper Pareto Tooltip
  const ParetoTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0 && chartSettings.showTooltip) {
      const data = payload[0]?.payload
      const countValue = data?.count || 0
      const cumulativeValue = data?.cumulativePercentage || 0
      const individualValue = data?.individualPercentage || 0
      const rank = data?.rank || 0

      return (
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-5 min-w-[300px] z-50">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-red-500"></div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{label}</p>
              <p className="text-sm text-gray-500">
                Rank #{rank} of {chartData.length}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Count</span>
              </div>
              <span className="font-bold text-blue-600 text-lg">{countValue.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Individual Impact</span>
              </div>
              <span className="font-bold text-green-600 text-lg">{individualValue}%</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700">Cumulative Impact</span>
              </div>
              <span className="font-bold text-red-600 text-lg">{cumulativeValue}%</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-red-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${cumulativeValue}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="font-medium">{cumulativeValue <= 80 ? "Critical Issue" : "Secondary Issue"}</span>
              <span>100%</span>
            </div>
          </div>

          {cumulativeValue <= 80 && (
            <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">High Priority - Focus Here!</span>
              </div>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const handleBarClick = (data: any) => {
    if (chartSettings.enableDrillDown) {
      alert(
        `Detailed Analysis: ${data.category}\n\n` +
          `• Count: ${data.count.toLocaleString()}\n` +
          `• Priority Rank: #${data.rank} of ${chartData.length}\n` +
          `• Individual Impact: ${data.individualPercentage}%\n` +
          `• Cumulative Impact: ${data.cumulativePercentage}%\n` +
          `• Status: ${data.cumulativePercentage <= 80 ? "CRITICAL - High Priority" : "Secondary Priority"}\n\n` +
          `Recommendation: ${
            data.cumulativePercentage <= 80
              ? "Immediate action required - this is a vital few issue"
              : "Monitor and address as resources allow"
          }`,
      )
    }
  }

  const updateSetting = (key: keyof typeof chartSettings, value: boolean) => {
    setChartSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleExport = () => {
    const exportData = {
      title: config.title,
      totalDefects: total,
      criticalItems: chartData.filter((item) => item.cumulativePercentage <= 80).length,
      data: chartData,
      analysis: {
        paretoEfficiency: Math.round(
          (chartData.filter((item) => item.cumulativePercentage <= 80).length / chartData.length) * 100,
        ),
        topIssueImpact: chartData[0]?.individualPercentage || 0,
        recommendations: [
          "Focus on top critical issues for maximum impact",
          "Address vital few to resolve 80% of problems",
          "Monitor trends to prevent escalation",
          "Regular review for continuous improvement",
        ],
      },
    }

    console.log("Exporting Pareto Analysis:", exportData)
    alert("Pareto analysis data exported to console. In a real application, this would download as Excel/PDF.")
  }

  // Find the 80% cutoff point
  const eightyPercentIndex = chartData.findIndex((item) => item.cumulativePercentage > 80)
  const criticalItems = eightyPercentIndex === -1 ? chartData.length : eightyPercentIndex

  // Show message if no data is available
  if (!config.data || config.data.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Pareto Analysis Chart
            </CardTitle>
            <CardDescription className="text-lg">
              Configure your device and sensor to see proper Pareto analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border-2 border-dashed border-blue-300">
              <div className="text-center max-w-md">
                <div className="text-8xl mb-8">📊</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Ready for Pareto Analysis</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Select a device and sensor to see the 80/20 rule in action with proper Pareto chart visualization.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ChartWrapper = config.wrapIntoCard ? Card : "div"
  const ContentWrapper = config.wrapIntoCard ? CardContent : "div"
  const HeaderWrapper = config.wrapIntoCard ? CardHeader : "div"

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <ChartWrapper
        className={
          config.wrapIntoCard
            ? "shadow-2xl border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 overflow-hidden"
            : ""
        }
        style={{
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          borderRadius: `${config.borderRadius}px`,
        }}
      >
        <HeaderWrapper
          className={config.wrapIntoCard ? "relative bg-gradient-to-r from-slate-800 to-slate-700 text-white" : "mb-6"}
        >
          <div className="flex items-center justify-between">
            <div>
              {config.showChartTitle && (
                <>
                  <CardTitle
                    className="flex items-center gap-3 text-white text-2xl font-bold"
                    style={{
                      fontFamily: config.chartFontStyle,
                      fontSize: `${safeNumber(config.titleFontSize, 24)}px`,
                      fontWeight:
                        config.titleFontWeight === "Bold"
                          ? "bold"
                          : config.titleFontWeight === "Light"
                            ? "300"
                            : "normal",
                      color: config.wrapIntoCard ? "white" : config.titleFontColor,
                    }}
                  >
                    <BarChart3 className="w-8 h-8" />
                    {config.title}
                  </CardTitle>
                  <CardDescription
                    className="text-slate-200 text-lg mt-2"
                    style={{
                      fontFamily: config.chartFontStyle,
                      color: config.wrapIntoCard ? "#cbd5e1" : "#6b7280",
                    }}
                  >
                    {config.description}
                    {config.selectedDevice && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-100 rounded-full text-sm font-medium">
                          📡 {config.selectedDevice}
                        </span>
                        {config.selectedSensor && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-100 rounded-full text-sm font-medium">
                            🔧 {config.selectedSensor.replace("-", " ")}
                          </span>
                        )}
                      </div>
                    )}
                  </CardDescription>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Export Button */}
              {config.showExportIcon && (
                <Button
                  variant="secondary"
                  size="sm"
                  className={config.wrapIntoCard ? "bg-white/10 hover:bg-white/20 border-white/20" : ""}
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}

              {/* Settings Button */}
              {config.showSettingIcon && (
                <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className={`h-10 w-10 p-0 ${config.wrapIntoCard ? "bg-white/10 hover:bg-white/20 border-white/20" : ""}`}
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-6 bg-white/95 backdrop-blur-sm" align="end">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-xl text-gray-800">Chart Settings</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setIsSettingsOpen(false)}
                      >
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
              )}
            </div>
          </div>
        </HeaderWrapper>

        <ContentWrapper className={config.wrapIntoCard ? "p-6" : ""}>
          <div
            className={`${config.wrapIntoCard ? "bg-white rounded-2xl shadow-lg p-4 border border-gray-100" : ""} ${config.enableScrollable ? "overflow-auto" : ""}`}
            style={{
              maxHeight: config.enableScrollable ? `${chartHeightPx + 100}px` : undefined,
              width: config.width !== "100%" ? `${config.width}px` : "100%",
            }}
          >
            <ChartContainer config={chartConfig} style={{ height: `${chartHeightPx}px`, width: "100%" }}>
              <ResponsiveContainer width="100%" height={chartHeightPx}>
                <ComposedChart
                  data={chartData}
                  margin={{
                    top: 50,
                    right: 120, // Increased from 80 to 120 for better right y-axis visibility
                    left: 80,
                    bottom: chartSettings.showLegend ? 160 : 140,
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
                      stroke={config.gridLineColor}
                      strokeOpacity={0.4}
                      strokeWidth={1}
                    />
                  )}

                  {/* X-Axis for Categories */}
                  <XAxis
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    interval={0}
                    tick={{
                      fontSize: safeNumber(config.fontSize, 12),
                      fontFamily: config.chartFontStyle,
                      fontWeight: 500,
                      fill: config.xAxisTextColor,
                    }}
                    axisLine={{
                      stroke: config.xAxisColor,
                      strokeWidth: 1,
                    }}
                    tickLine={{
                      stroke: config.xAxisColor,
                      strokeWidth: 1,
                    }}
                    label={
                      chartSettings.showLabels
                        ? {
                            value: "Categories (Ranked by Frequency)",
                            position: "insideBottom",
                            offset: -10,
                            style: {
                              textAnchor: "middle",
                              fontSize: `${safeNumber(config.fontSize, 12) + 2}px`,
                              fontWeight: "600",
                              fontFamily: config.chartFontStyle,
                              fill: config.xAxisLabelFontColor,
                            },
                          }
                        : undefined
                    }
                  />

                  {/* Left Y-Axis for Count Values */}
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={[0, "dataMax"]}
                    tick={{
                      fontSize: safeNumber(config.fontSize, 12),
                      fontFamily: config.chartFontStyle,
                      fontWeight: 500,
                      fill: config.yAxisTextColor,
                    }}
                    axisLine={{
                      stroke: config.yAxisColor,
                      strokeWidth: 1,
                    }}
                    tickLine={{
                      stroke: config.yAxisColor,
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
                              fontSize: `${safeNumber(config.fontSize, 12) + 2}px`,
                              fontWeight: "600",
                              fontFamily: config.chartFontStyle,
                              fill: config.yAxisLabelFontColor,
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
                      fontSize: safeNumber(config.fontSize, 12),
                      fontFamily: config.chartFontStyle,
                      fontWeight: 500,
                      fill: config.yAxisTextColor,
                    }}
                    axisLine={{
                      stroke: config.yAxisColor,
                      strokeWidth: 1,
                    }}
                    tickLine={{
                      stroke: config.yAxisColor,
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
                              fontSize: `${safeNumber(config.fontSize, 12) + 2}px`,
                              fontWeight: "600",
                              fontFamily: config.chartFontStyle,
                              fill: config.yAxisLabelFontColor,
                            },
                          }
                        : undefined
                    }
                  />

                  {/* Enhanced Tooltip */}
                  <Tooltip
                    content={<ParetoTooltip />}
                    cursor={{
                      fill: "rgba(59, 130, 246, 0.08)",
                      stroke: "rgba(59, 130, 246, 0.2)",
                      strokeWidth: 1,
                    }}
                    animationDuration={150}
                  />

                  {/* 80% Threshold Reference Line - No Label */}
                  {chartSettings.showThresholdLine && (
                    <ReferenceLine
                      yAxisId="right"
                      y={80}
                      stroke={colors.threshold}
                      strokeWidth={3}
                      strokeDasharray="8 4"
                    />
                  )}

                  {/* Bars for Frequency Count */}
                  <Bar
                    yAxisId="left"
                    dataKey="count"
                    fill={colors.primary}
                    name="Count"
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
                          fill: config.yAxisTextColor,
                          fontFamily: config.chartFontStyle,
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
                          fontFamily: config.chartFontStyle,
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
                        fontSize: `${safeNumber(config.fontSize, 12) + 2}px`,
                        fontFamily: config.chartFontStyle,
                        fontWeight: "500",
                        color: config.legendTextColor,
                      }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Comprehensive Pareto Analysis Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h4 className="font-bold text-base text-blue-900">Total Issues</h4>
              </div>
              <p className="text-2xl font-bold text-blue-700">{total.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-1">Across all categories</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6 text-red-600" />
                <h4 className="font-bold text-base text-red-900">Critical Issues</h4>
              </div>
              <p className="text-2xl font-bold text-red-700">{criticalItems}</p>
              <p className="text-sm text-red-600 mt-1">within 80% threshold</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h4 className="font-bold text-base text-green-900">Top Issue Impact</h4>
              </div>
              <p className="text-2xl font-bold text-green-700">{chartData[0]?.individualPercentage || 0}%</p>
              <p className="text-sm text-green-600 mt-1">of total issues</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h4 className="font-bold text-base text-amber-900">Pareto Efficiency</h4>
              </div>
              <p className="text-2xl font-bold text-amber-700">
                {Math.round((criticalItems / chartData.length) * 100)}%
              </p>
              <p className="text-sm text-amber-600 mt-1">of issues cause 80% problems</p>
            </div>
          </div>
        </ContentWrapper>
      </ChartWrapper>
    </div>
  )
}
