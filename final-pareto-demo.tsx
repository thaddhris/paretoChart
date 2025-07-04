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

// Comprehensive dummy data for manufacturing quality defects
const manufacturingDefectsData = [
  { category: "Surface Scratches", count: 342 },
  { category: "Dimensional Variance", count: 287 },
  { category: "Material Defects", count: 234 },
  { category: "Assembly Misalignment", count: 189 },
  { category: "Paint/Coating Issues", count: 156 },
  { category: "Weld Defects", count: 123 },
  { category: "Electrical Faults", count: 98 },
  { category: "Missing Components", count: 76 },
  { category: "Packaging Damage", count: 54 },
  { category: "Calibration Errors", count: 43 },
  { category: "Tool Wear", count: 32 },
  { category: "Environmental Issues", count: 21 },
  { category: "Documentation Errors", count: 15 },
  { category: "Other", count: 12 },
]

export default function FinalParetoDemo() {
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

  // Configuration based on user settings
  const config = {
    title: "Manufacturing Quality Defects - Pareto Analysis",
    description:
      "Comprehensive analysis of quality issues to identify critical improvement areas using the 80/20 principle",
    selectedDevice: "Production Line A - Device-001",
    selectedSensor: "Quality Control Sensors",
    chartFontStyle: "Inter",
    fontSize: "14",
    titleFontSize: "24",
    titleFontWeight: "Bold",
    titleFontColor: "#1F2937",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: "12",
    barColor: "#2563EB",
    lineColor: "#DC2626",
    gridLineColor: "#F3F4F6",
    xAxisTextColor: "#374151",
    yAxisTextColor: "#374151",
    xAxisLabelFontColor: "#1F2937",
    yAxisLabelFontColor: "#1F2937",
    xAxisColor: "#D1D5DB",
    yAxisColor: "#D1D5DB",
    legendTextColor: "#1F2937",
    height: "600",
    width: "100%",
  }

  // Sort data by count in descending order (proper Pareto principle)
  const sortedData = [...manufacturingDefectsData].sort((a, b) => b.count - a.count)

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
                <span className="text-sm font-medium text-gray-700">Defect Count</span>
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
          `• Defect Count: ${data.count.toLocaleString()}\n` +
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

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 overflow-hidden">
        <CardHeader className="relative bg-gradient-to-r from-slate-800 to-slate-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-white text-2xl font-bold">
                <BarChart3 className="w-8 h-8" />
                {config.title}
              </CardTitle>
              <CardDescription className="text-slate-200 text-lg mt-2">
                {config.description}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-100 rounded-full text-sm font-medium">
                    📡 {config.selectedDevice}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-100 rounded-full text-sm font-medium">
                    🔧 {config.selectedSensor}
                  </span>
                </div>
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              {/* Export Button */}
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              {/* Settings Button */}
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
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <ChartContainer config={chartConfig} style={{ height: "600px", width: "100%" }}>
              <ResponsiveContainer width="100%" height={600}>
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
                    height={140}
                    interval={0}
                    tick={{
                      fontSize: 12,
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
                            value: "Quality Defect Categories (Ranked by Frequency)",
                            position: "insideBottom",
                            offset: -10,
                            style: {
                              textAnchor: "middle",
                              fontSize: "14px",
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
                      fontSize: 12,
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
                            value: "Defect Frequency Count",
                            angle: -90,
                            position: "insideLeft",
                            style: {
                              textAnchor: "middle",
                              fontSize: "14px",
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
                      fontSize: 12,
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
                              fontSize: "14px",
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

                  {/* 80% Threshold Reference Line */}
                  {chartSettings.showThresholdLine && (
                    <ReferenceLine
                      yAxisId="right"
                      y={80}
                      stroke={colors.threshold}
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      label={{
                        value: "80% Pareto Threshold",
                        position: "topRight",
                        style: {
                          fontSize: "14px",
                          fontWeight: "700",
                          fill: colors.threshold,
                          fontFamily: config.chartFontStyle,
                        },
                      }}
                    />
                  )}

                  {/* Bars for Frequency Count */}
                  <Bar
                    yAxisId="left"
                    dataKey="count"
                    fill={colors.primary}
                    name="Defect Count"
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
                        fontSize: "14px",
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
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <h4 className="font-bold text-lg text-blue-900">Total Defects</h4>
              </div>
              <p className="text-3xl font-bold text-blue-700">{total.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-2">Across all categories</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-8 h-8 text-red-600" />
                <h4 className="font-bold text-lg text-red-900">Critical Issues</h4>
              </div>
              <p className="text-3xl font-bold text-red-700">{criticalItems}</p>
              <p className="text-sm text-red-600 mt-2">within 80% threshold</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <h4 className="font-bold text-lg text-green-900">Top Issue Impact</h4>
              </div>
              <p className="text-3xl font-bold text-green-700">{chartData[0]?.individualPercentage || 0}%</p>
              <p className="text-sm text-green-600 mt-2">of total defects</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
                <h4 className="font-bold text-lg text-amber-900">Pareto Efficiency</h4>
              </div>
              <p className="text-3xl font-bold text-amber-700">
                {Math.round((criticalItems / chartData.length) * 100)}%
              </p>
              <p className="text-sm text-amber-600 mt-2">of issues cause 80% problems</p>
            </div>
          </div>

          {/* Detailed Pareto Insights */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Pareto Analysis Insights & Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Critical Issues (Focus Here First)</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {chartData.slice(0, criticalItems).map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-white rounded-lg border shadow-sm"
                    >
                      <div>
                        <span className="font-medium text-sm">{item.category}</span>
                        <div className="text-xs text-gray-500">Rank #{item.rank}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-blue-600">{item.count.toLocaleString()}</span>
                        <div className="text-xs text-gray-500">{item.individualPercentage}% individual</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Strategic Recommendations</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800">Immediate Action Required</p>
                      <p>Focus on top {criticalItems} defect types to achieve maximum quality improvement impact</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800">80/20 Rule Application</p>
                      <p>Addressing these critical issues will resolve approximately 80% of quality problems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800">Resource Allocation</p>
                      <p>Allocate quality improvement resources proportionally to defect frequency and impact</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800">Continuous Monitoring</p>
                      <p>Regular Pareto analysis to track improvement progress and identify emerging issues</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <h4 className="font-bold text-lg text-green-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Next Steps & Action Items
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-700 mb-2">Week 1-2: Immediate Actions</h5>
                <ul className="space-y-1 text-green-600">
                  <li>• Root cause analysis for top 3 defects</li>
                  <li>• Form improvement teams</li>
                  <li>• Set reduction targets</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-700 mb-2">Month 1: Implementation</h5>
                <ul className="space-y-1 text-green-600">
                  <li>• Deploy corrective actions</li>
                  <li>• Monitor progress daily</li>
                  <li>• Adjust processes as needed</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-700 mb-2">Ongoing: Sustain</h5>
                <ul className="space-y-1 text-green-600">
                  <li>• Weekly Pareto updates</li>
                  <li>• Celebrate improvements</li>
                  <li>• Prevent regression</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
