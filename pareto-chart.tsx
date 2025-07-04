"use client"

import { Bar, Line, ComposedChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  // Sample data for defect types in manufacturing
  const rawData = [
    { category: "Scratches", count: 45 },
    { category: "Dents", count: 32 },
    { category: "Paint Issues", count: 28 },
    { category: "Alignment", count: 15 },
    { category: "Missing Parts", count: 12 },
    { category: "Electrical", count: 8 },
    { category: "Other", count: 5 },
  ]

  // Calculate cumulative percentages
  const total = rawData.reduce((sum, item) => sum + item.count, 0)
  let cumulative = 0

  const chartData = rawData.map((item) => {
    cumulative += item.count
    const cumulativePercentage = (cumulative / total) * 100
    return {
      ...item,
      cumulativePercentage: Math.round(cumulativePercentage * 10) / 10,
    }
  })

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
    cumulativePercentage: {
      label: "Cumulative %",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Pareto Chart - Quality Defects Analysis</CardTitle>
          <CardDescription>Defect frequency and cumulative percentage showing the 80/20 principle</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{
                  top: 30,
                  right: 60,
                  left: 60,
                  bottom: 120,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{
                    fontSize: 13,
                    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                    fontWeight: 500,
                    fill: "#374151",
                  }}
                  label={{
                    value: "Defect Categories",
                    position: "insideBottom",
                    offset: -5,
                    style: {
                      textAnchor: "middle",
                      fontSize: "16px",
                      fontWeight: "600",
                      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                      fill: "#1f2937",
                    },
                  }}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{
                    fontSize: 13,
                    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                    fontWeight: 500,
                    fill: "#374151",
                  }}
                  label={{
                    value: "Count",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      textAnchor: "middle",
                      fontSize: "16px",
                      fontWeight: "600",
                      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                      fill: "#1f2937",
                    },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{
                    fontSize: 13,
                    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                    fontWeight: 500,
                    fill: "#374151",
                  }}
                  label={{
                    value: "Cumulative Percentage (%)",
                    angle: 90,
                    position: "insideRight",
                    style: {
                      textAnchor: "middle",
                      fontSize: "16px",
                      fontWeight: "600",
                      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                      fill: "#1f2937",
                    },
                  }}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm">
                            <span className="inline-block w-3 h-3 bg-chart-1 rounded mr-2"></span>
                            Count: {payload[0]?.value}
                          </p>
                          <p className="text-sm">
                            <span className="inline-block w-3 h-3 bg-chart-2 rounded mr-2"></span>
                            Cumulative: {payload[1]?.value}%
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar yAxisId="left" dataKey="count" fill="var(--color-count)" name="Count" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulativePercentage"
                  stroke="var(--color-cumulativePercentage)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-cumulativePercentage)", strokeWidth: 2, r: 4 }}
                  name="Cumulative %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Total Defects</h4>
              <p className="text-2xl font-bold text-chart-1">{total}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Top 3 Categories</h4>
              <p className="text-lg font-semibold text-chart-2">
                {Math.round((chartData[2]?.cumulativePercentage || 0) * 10) / 10}%
              </p>
              <p className="text-xs text-muted-foreground">of total defects</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Pareto Principle</h4>
              <p className="text-xs text-muted-foreground">
                Focus on the vital few categories that contribute to most issues
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
