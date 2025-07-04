"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings } from "lucide-react"
import FinalParetoChart from "./final-pareto-chart"

interface DataItem {
  category: string
  count: number
}

interface ChartConfig {
  // Data Configuration
  title: string
  description: string
  data: DataItem[]
  dataSource: string
  selectedDevice: string
  selectedSensor: string
  sortOrder: string

  // Time Configuration
  timezone: string
  refreshInterval: string
  dateRange: string

  // Style Configuration
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

// Color palette options
const colorPalette = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#85C1E9",
  "#F4D03F",
  "#AED6F1",
  "#A569BD",
  "#5DADE2",
  "#58D68D",
  "#F7DC6F",
  "#EC7063",
  "#3498DB",
  "#2ECC71",
  "#F39C12",
  "#9B59B6",
  "#E74C3C",
  "#1ABC9C",
  "#E67E22",
  "#34495E",
  "#95A5A6",
  "#16A085",
  "#27AE60",
  "#2980B9",
  "#8E44AD",
  "#2C3E50",
  "#F1C40F",
  "#E74C3C",
  "#ECF0F1",
  "#BDC3C7",
  "#7F8C8D",
]

// Color picker component
const ColorPicker = ({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (color: string) => void
  label: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Label className="text-teal-600 font-medium">{label} *</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="flex gap-2 cursor-pointer">
            <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#FFFFFF" className="flex-1" />
            <div
              className="w-10 h-10 border-2 border-gray-300 rounded cursor-pointer hover:border-gray-400 transition-colors"
              style={{ backgroundColor: value }}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="end">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Choose Color</h4>
            <div className="grid grid-cols-8 gap-2">
              {colorPalette.map((color, index) => (
                <button
                  key={index}
                  className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onChange(color)
                    setIsOpen(false)
                  }}
                  title={color}
                />
              ))}
            </div>
            <div className="pt-2 border-t">
              <Label className="text-xs text-gray-500">Custom Color</Label>
              <Input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-8 mt-1"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function ConfigPanel() {
  const [activeTab, setActiveTab] = useState("data")
  const [showPreview, setShowPreview] = useState(false)
  const [showFinalChart, setShowFinalChart] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>([0]) // Sunday selected by default
  const [chartKey, setChartKey] = useState(0)

  const [config, setConfig] = useState<ChartConfig>({
    title: "Manufacturing Quality Defects - Pareto Analysis",
    description:
      "Comprehensive analysis of quality issues to identify critical improvement areas using the 80/20 principle",
    data: [
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
    ],
    dataSource: "single-device",
    selectedDevice: "device-001",
    selectedSensor: "temperature",
    sortOrder: "descending",
    timezone: "Asia/Calcutta",
    refreshInterval: "5",
    dateRange: "last-7-days",
    chartSize: "Custom",
    width: "1200",
    height: "600",
    errorZIndex: "1",
    wrapIntoCard: true,
    enableScrollable: false,
    showSettingIcon: true,
    showExportIcon: true,
    showChartTitle: true,
    advanceSettings: true,
    chartFontStyle: "Inter",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: "12",
    yAxisLabelFontColor: "#1F2937",
    yAxisTextColor: "#374151",
    xAxisLabelFontColor: "#1F2937",
    xAxisTextColor: "#374151",
    yAxisColor: "#D1D5DB",
    xAxisColor: "#D1D5DB",
    titleFontSize: "24",
    titleFontWeight: "Bold",
    titleFontColor: "#1F2937",
    gridLineColor: "#F3F4F6",
    legendTextColor: "#1F2937",
    barColor: "#2563EB",
    lineColor: "#DC2626",
    fontSize: "14",
  })

  const updateConfig = (key: keyof ChartConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    // Force chart re-render when config changes
    setChartKey((prev) => prev + 1)
  }

  const generateDeviceSensorData = (device: string, sensor: string): DataItem[] => {
    const deviceSensorData: Record<string, Record<string, DataItem[]>> = {
      "device-001": {
        temperature: [
          { category: "Overheating Events", count: 285 },
          { category: "Temperature Spikes", count: 162 },
          { category: "Cooling System Failures", count: 145 },
          { category: "Sensor Drift", count: 98 },
          { category: "Calibration Issues", count: 67 },
          { category: "Environmental Factors", count: 45 },
          { category: "Hardware Malfunction", count: 23 },
        ],
        pressure: [
          { category: "Pressure Drops", count: 178 },
          { category: "System Leaks", count: 156 },
          { category: "Valve Failures", count: 143 },
          { category: "Pump Issues", count: 98 },
          { category: "Blockages", count: 67 },
          { category: "Sensor Errors", count: 34 },
          { category: "Maintenance Issues", count: 19 },
        ],
        vibration: [
          { category: "Bearing Wear", count: 192 },
          { category: "Misalignment", count: 167 },
          { category: "Imbalance", count: 134 },
          { category: "Looseness", count: 98 },
          { category: "Belt Issues", count: 65 },
          { category: "Motor Problems", count: 43 },
          { category: "Foundation Issues", count: 21 },
        ],
        humidity: [
          { category: "Moisture Buildup", count: 164 },
          { category: "Condensation Issues", count: 148 },
          { category: "Ventilation Problems", count: 125 },
          { category: "Seal Failures", count: 89 },
          { category: "Weather Impact", count: 56 },
          { category: "HVAC Malfunction", count: 34 },
          { category: "Insulation Degradation", count: 18 },
        ],
      },
      "device-002": {
        temperature: [
          { category: "Thermal Overload", count: 173 },
          { category: "Heat Exchanger Issues", count: 158 },
          { category: "Insulation Problems", count: 141 },
          { category: "Ambient Temperature", count: 89 },
          { category: "Control System Errors", count: 67 },
          { category: "Maintenance Delays", count: 34 },
          { category: "Design Limitations", count: 16 },
        ],
        "flow-rate": [
          { category: "Flow Restrictions", count: 289 },
          { category: "Pump Degradation", count: 164 },
          { category: "Pipe Corrosion", count: 147 },
          { category: "Control Valve Issues", count: 125 },
          { category: "Filter Clogging", count: 89 },
          { category: "Measurement Errors", count: 43 },
          { category: "System Design", count: 28 },
        ],
        "power-consumption": [
          { category: "Motor Inefficiency", count: 195 },
          { category: "Load Variations", count: 171 },
          { category: "Power Quality Issues", count: 152 },
          { category: "Equipment Aging", count: 138 },
          { category: "Control System Faults", count: 94 },
          { category: "Environmental Conditions", count: 56 },
          { category: "Maintenance Neglect", count: 29 },
        ],
      },
      "device-003": {
        vibration: [
          { category: "Quality Control Failures", count: 356 },
          { category: "Calibration Drift", count: 234 },
          { category: "Measurement Inconsistency", count: 198 },
          { category: "Operator Errors", count: 176 },
          { category: "Equipment Wear", count: 154 },
          { category: "Environmental Interference", count: 132 },
          { category: "Software Glitches", count: 98 },
        ],
        pressure: [
          { category: "Inspection Failures", count: 242 },
          { category: "Tolerance Violations", count: 218 },
          { category: "Material Defects", count: 187 },
          { category: "Process Variations", count: 165 },
          { category: "Tool Wear", count: 143 },
          { category: "Setup Errors", count: 98 },
          { category: "Documentation Issues", count: 65 },
        ],
      },
      "device-004": {
        "power-consumption": [
          { category: "Packaging Line Jams", count: 403 },
          { category: "Label Misalignment", count: 267 },
          { category: "Seal Quality Issues", count: 234 },
          { category: "Material Feed Problems", count: 198 },
          { category: "Speed Variations", count: 176 },
          { category: "Conveyor Issues", count: 145 },
          { category: "Sensor Malfunctions", count: 123 },
        ],
        temperature: [
          { category: "Heat Sealing Problems", count: 287 },
          { category: "Cooling System Issues", count: 245 },
          { category: "Material Overheating", count: 212 },
          { category: "Temperature Control", count: 189 },
          { category: "Thermal Expansion", count: 167 },
          { category: "Ambient Conditions", count: 134 },
          { category: "Equipment Aging", count: 121 },
        ],
      },
      "device-005": {
        vibration: [
          { category: "Assembly Line Stoppages", count: 324 },
          { category: "Component Misalignment", count: 298 },
          { category: "Fastening Issues", count: 276 },
          { category: "Tool Wear", count: 154 },
          { category: "Quality Rejections", count: 142 },
          { category: "Material Shortages", count: 128 },
          { category: "Operator Training", count: 115 },
        ],
        pressure: [
          { category: "Pneumatic System Failures", count: 256 },
          { category: "Air Pressure Drops", count: 223 },
          { category: "Actuator Problems", count: 189 },
          { category: "Valve Malfunctions", count: 167 },
          { category: "Leak Detection", count: 145 },
          { category: "Compressor Issues", count: 123 },
          { category: "Filter Blockages", count: 112 },
        ],
      },
      "cluster-west": {
        "cpu-usage": [
          { category: "Resource Intensive Tasks", count: 456 },
          { category: "Memory Leaks", count: 398 },
          { category: "Background Processes", count: 367 },
          { category: "Network Bottlenecks", count: 334 },
          { category: "Database Queries", count: 298 },
          { category: "System Updates", count: 267 },
          { category: "Hardware Limitations", count: 234 },
        ],
        "memory-usage": [
          { category: "Memory Leaks", count: 434 },
          { category: "Large Dataset Processing", count: 389 },
          { category: "Cache Overflow", count: 345 },
          { category: "Application Bloat", count: 312 },
          { category: "Inefficient Algorithms", count: 278 },
          { category: "System Fragmentation", count: 245 },
          { category: "Hardware Constraints", count: 223 },
        ],
        "network-latency": [
          { category: "Network Congestion", count: 498 },
          { category: "Bandwidth Limitations", count: 434 },
          { category: "Routing Issues", count: 378 },
          { category: "Hardware Failures", count: 334 },
          { category: "Configuration Errors", count: 289 },
          { category: "External Dependencies", count: 256 },
          { category: "Security Scanning", count: 228 },
        ],
      },
      "cluster-east": {
        "cpu-usage": [
          { category: "High Load Applications", count: 387 },
          { category: "Concurrent Processing", count: 345 },
          { category: "Resource Contention", count: 312 },
          { category: "Inefficient Code", count: 289 },
          { category: "System Overhead", count: 267 },
          { category: "Background Tasks", count: 234 },
          { category: "Hardware Aging", count: 218 },
        ],
        "disk-io": [
          { category: "Disk I/O Bottlenecks", count: 423 },
          { category: "Storage Fragmentation", count: 378 },
          { category: "File System Issues", count: 334 },
          { category: "Database Operations", count: 298 },
          { category: "Backup Processes", count: 267 },
          { category: "Log File Growth", count: 245 },
          { category: "Hardware Failures", count: 223 },
        ],
      },
      "compute-node-1": {
        "performance-metrics": [
          { category: "High Latency Operations", count: 545 },
          { category: "Resource Contention", count: 467 },
          { category: "I/O Bottlenecks", count: 398 },
          { category: "Network Congestion", count: 356 },
          { category: "Memory Allocation", count: 323 },
          { category: "CPU Throttling", count: 289 },
          { category: "Storage Issues", count: 245 },
        ],
        "error-logs": [
          { category: "Connection Timeouts", count: 487 },
          { category: "Authentication Failures", count: 434 },
          { category: "Resource Not Found", count: 389 },
          { category: "Permission Denied", count: 345 },
          { category: "Service Unavailable", count: 312 },
          { category: "Data Validation Errors", count: 278 },
          { category: "System Exceptions", count: 234 },
        ],
        "memory-usage": [
          { category: "Memory Exhaustion", count: 398 },
          { category: "Garbage Collection", count: 356 },
          { category: "Memory Fragmentation", count: 323 },
          { category: "Buffer Overflows", count: 289 },
          { category: "Heap Allocation", count: 267 },
          { category: "Stack Overflow", count: 234 },
          { category: "Memory Leaks", count: 223 },
        ],
      },
      "compute-node-2": {
        "cpu-usage": [
          { category: "Compute Intensive Tasks", count: 434 },
          { category: "Parallel Processing", count: 389 },
          { category: "Algorithm Complexity", count: 345 },
          { category: "Resource Scheduling", count: 312 },
          { category: "Context Switching", count: 278 },
          { category: "Interrupt Handling", count: 245 },
          { category: "System Calls", count: 223 },
        ],
        "network-latency": [
          { category: "Inter-node Communication", count: 467 },
          { category: "Data Transfer Delays", count: 398 },
          { category: "Protocol Overhead", count: 356 },
          { category: "Network Topology", count: 323 },
          { category: "Bandwidth Saturation", count: 289 },
          { category: "Packet Loss", count: 256 },
          { category: "Routing Inefficiency", count: 228 },
        ],
      },
      "edge-gateway-01": {
        "network-latency": [
          { category: "Edge Connectivity Issues", count: 278 },
          { category: "Cellular Signal Strength", count: 234 },
          { category: "Data Transmission Errors", count: 198 },
          { category: "Protocol Handshakes", count: 176 },
          { category: "Security Overhead", count: 154 },
          { category: "Device Synchronization", count: 132 },
          { category: "Firmware Updates", count: 118 },
        ],
        "error-logs": [
          { category: "Connection Drops", count: 256 },
          { category: "Authentication Timeouts", count: 223 },
          { category: "Data Corruption", count: 189 },
          { category: "Protocol Violations", count: 167 },
          { category: "Buffer Overruns", count: 145 },
          { category: "Sync Failures", count: 128 },
          { category: "Hardware Resets", count: 115 },
        ],
      },
    }

    // Return specific data for device-sensor combination, or default manufacturing data if not found
    return deviceSensorData[device]?.[sensor] || config.data
  }

  const handleSensorChange = (sensor: string) => {
    updateConfig("selectedSensor", sensor)
    // Generate realistic data based on device-sensor combination
    const newData = generateDeviceSensorData(config.selectedDevice, sensor)
    updateConfig("data", newData)
    // Update title and description based on selection
    updateConfig("title", `${config.selectedDevice.toUpperCase()} - ${sensor.replace("-", " ").toUpperCase()} Analysis`)
    updateConfig("description", `Pareto analysis of ${sensor.replace("-", " ")} issues from ${config.selectedDevice}`)
  }

  const handleDeviceChange = (device: string) => {
    updateConfig("selectedDevice", device)
    // Reset sensor when device changes
    updateConfig("selectedSensor", "")
    // Use default manufacturing data until sensor is selected
    updateConfig("data", [
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
    ])
  }

  const handleNext = () => {
    if (activeTab === "data") {
      setActiveTab("time")
    } else if (activeTab === "time") {
      setActiveTab("style")
    }
  }

  const handleUpdateWidget = () => {
    setShowFinalChart(true)
  }

  if (showFinalChart) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Configured Pareto Chart</h1>
            <Button variant="outline" onClick={() => setShowFinalChart(false)}>
              Back to Configuration
            </Button>
          </div>
          <FinalParetoChart key={chartKey} config={config} />
        </div>
      </div>
    )
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Pareto Chart Preview</h1>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Back to Configuration
              </Button>
              <Button onClick={handleUpdateWidget}>Update Widget</Button>
            </div>
          </div>
          <FinalParetoChart key={chartKey} config={config} />
        </div>
      </div>
    )
  }

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) => (prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="bg-slate-700 text-white">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6" />
              <CardTitle>Configure Pareto Chart Widget</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="data" className="flex items-center gap-2">
                  <span className="bg-slate-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    1
                  </span>
                  Data Configuration
                </TabsTrigger>
                <TabsTrigger value="time" className="flex items-center gap-2">
                  <span className="bg-slate-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    2
                  </span>
                  Time Configuration
                </TabsTrigger>
                <TabsTrigger value="style" className="flex items-center gap-2">
                  <span className="bg-slate-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    3
                  </span>
                  Style Configuration
                </TabsTrigger>
              </TabsList>

              <TabsContent value="data" className="space-y-6">
                {/* Chart Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Chart Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-teal-600 font-medium">
                        Chart Title *
                      </Label>
                      <Input
                        id="title"
                        value={config.title}
                        onChange={(e) => updateConfig("title", e.target.value)}
                        placeholder="Enter chart title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-teal-600 font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={config.description}
                        onChange={(e) => updateConfig("description", e.target.value)}
                        placeholder="Describe what this Pareto chart analyzes"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Data Source Configuration */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Data Source</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-teal-600 font-medium">Data Source Type *</Label>
                      <Select value={config.dataSource} onValueChange={(value) => updateConfig("dataSource", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single-device">Single Device</SelectItem>
                          <SelectItem value="cluster">Cluster</SelectItem>
                          <SelectItem value="compute">Compute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Device and Sensor Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Device and Sensor Selection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-teal-600 font-medium">Select Device *</Label>
                      <Select value={config.selectedDevice} onValueChange={handleDeviceChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a device" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="device-001">Device-001 (Production Line A)</SelectItem>
                          <SelectItem value="device-002">Device-002 (Production Line B)</SelectItem>
                          <SelectItem value="device-003">Device-003 (Quality Control)</SelectItem>
                          <SelectItem value="device-004">Device-004 (Packaging Unit)</SelectItem>
                          <SelectItem value="device-005">Device-005 (Assembly Station)</SelectItem>
                          <SelectItem value="cluster-west">Cluster-West (Multiple Devices)</SelectItem>
                          <SelectItem value="cluster-east">Cluster-East (Multiple Devices)</SelectItem>
                          <SelectItem value="compute-node-1">Compute-Node-1</SelectItem>
                          <SelectItem value="compute-node-2">Compute-Node-2</SelectItem>
                          <SelectItem value="edge-gateway-01">Edge-Gateway-01</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-teal-600 font-medium">Select Sensor *</Label>
                      <Select
                        value={config.selectedSensor}
                        onValueChange={handleSensorChange}
                        disabled={!config.selectedDevice}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a sensor" />
                        </SelectTrigger>
                        <SelectContent>
                          {config.selectedDevice && (
                            <>
                              <SelectItem value="temperature">Temperature Sensor</SelectItem>
                              <SelectItem value="pressure">Pressure Sensor</SelectItem>
                              <SelectItem value="vibration">Vibration Sensor</SelectItem>
                              <SelectItem value="humidity">Humidity Sensor</SelectItem>
                              <SelectItem value="flow-rate">Flow Rate Sensor</SelectItem>
                              <SelectItem value="power-consumption">Power Consumption</SelectItem>
                              <SelectItem value="error-logs">Error Logs</SelectItem>
                              <SelectItem value="performance-metrics">Performance Metrics</SelectItem>
                              <SelectItem value="network-latency">Network Latency</SelectItem>
                              <SelectItem value="cpu-usage">CPU Usage</SelectItem>
                              <SelectItem value="memory-usage">Memory Usage</SelectItem>
                              <SelectItem value="disk-io">Disk I/O</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {config.selectedDevice && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-800">Data Source Connected</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        <strong>Device:</strong> {config.selectedDevice}
                        {config.selectedSensor && (
                          <>
                            {" | "}
                            <strong>Sensor:</strong> {config.selectedSensor}
                          </>
                        )}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {config.selectedSensor
                          ? "The Pareto chart will analyze data from this device-sensor combination to identify the most significant issues or patterns."
                          : "Select a sensor to complete the data source configuration."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Sort Configuration */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sort Configuration</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-teal-600 font-medium">Sort Order *</Label>
                      <Select value={config.sortOrder} onValueChange={(value) => updateConfig("sortOrder", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="descending">Descending (High to Low)</SelectItem>
                          <SelectItem value="ascending">Ascending (Low to High)</SelectItem>
                          <SelectItem value="custom">Custom Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="time" className="space-y-6">
                <div>
                  <Label htmlFor="timezone" className="text-teal-600 font-medium">
                    Timezone *
                  </Label>
                  <Select value={config.timezone} onValueChange={(value) => updateConfig("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Calcutta">Asia/Calcutta</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Link Time with</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-teal-600 font-medium">Global time picker *</Label>
                      <Select defaultValue="global-time-picker">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global-time-picker">Global Time Picker</SelectItem>
                          <SelectItem value="local-time-picker">Local Time Picker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-teal-600 font-medium">Global Time Picker *</Label>
                      <Select defaultValue="date-picker">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date-picker">Date Picker</SelectItem>
                          <SelectItem value="time-picker">Time Picker</SelectItem>
                          <SelectItem value="datetime-picker">DateTime Picker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Define Cycle Time</h3>
                  <div className="space-y-4">
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="cycleType" value="calendar" defaultChecked className="w-4 h-4" />
                        <span>Calendar Year</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="cycleType" value="financial" className="w-4 h-4" />
                        <span>Financial Year</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="cycleType" value="custom" className="w-4 h-4" />
                        <span>Custom</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-teal-600 font-medium">Hr *</Label>
                        <Select defaultValue="00">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-teal-600 font-medium">Min *</Label>
                        <Select defaultValue="00">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 60 }, (_, i) => (
                              <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-teal-600 font-medium">Cycle Time Identifier *</Label>
                        <Select defaultValue="start">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="start">Start</SelectItem>
                            <SelectItem value="end">End</SelectItem>
                            <SelectItem value="middle">Middle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="font-medium">Day</Label>
                      <div className="flex gap-2 mt-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => toggleDay(index)}
                            className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors ${
                              selectedDays.includes(index)
                                ? "bg-slate-700 text-white border-slate-700"
                                : "bg-white text-gray-700 border-gray-300 hover:border-slate-400 hover:bg-gray-50"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="font-medium">Date</Label>
                        <Select defaultValue="1">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="font-medium">Month</Label>
                        <Select defaultValue="january">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="january">January</SelectItem>
                            <SelectItem value="february">February</SelectItem>
                            <SelectItem value="march">March</SelectItem>
                            <SelectItem value="april">April</SelectItem>
                            <SelectItem value="may">May</SelectItem>
                            <SelectItem value="june">June</SelectItem>
                            <SelectItem value="july">July</SelectItem>
                            <SelectItem value="august">August</SelectItem>
                            <SelectItem value="september">September</SelectItem>
                            <SelectItem value="october">October</SelectItem>
                            <SelectItem value="november">November</SelectItem>
                            <SelectItem value="december">December</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-teal-600 font-medium">Default Duration *</Label>
                        <Select defaultValue="1-hour">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15-min">15 Minutes</SelectItem>
                            <SelectItem value="30-min">30 Minutes</SelectItem>
                            <SelectItem value="1-hour">1 Hour</SelectItem>
                            <SelectItem value="2-hour">2 Hours</SelectItem>
                            <SelectItem value="4-hour">4 Hours</SelectItem>
                            <SelectItem value="8-hour">8 Hours</SelectItem>
                            <SelectItem value="1-day">1 Day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="font-medium">Default Periodicity *</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger className="w-full md:w-1/3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enableShift">Enable Shift Comparison</Label>
                        <Switch id="enableShift" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enableComparison">Enable Comparison Mode</Label>
                        <Switch id="enableComparison" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold">Custom Time Navigation</h3>
                    <div className="w-4 h-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center">
                      ?
                    </div>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {[
                      { label: "Yearly", checked: true },
                      { label: "Quarterly", checked: true },
                      { label: "Monthly", checked: true },
                      { label: "Weekly", checked: true },
                      { label: "Daily", checked: true },
                      { label: "Hourly", checked: false },
                    ].map((item) => (
                      <label key={item.label} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="enableFuture">Enable Future Date selection</Label>
                    <div className="w-4 h-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center">
                      ?
                    </div>
                  </div>
                  <Switch id="enableFuture" />
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-6">
                {/* Chart Size Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-teal-600 font-medium">Chart Size *</Label>
                      <Select value={config.chartSize} onValueChange={(value) => updateConfig("chartSize", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Small">Small</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Large">Large</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-teal-600 font-medium">Width in px *</Label>
                      <Input
                        value={config.width}
                        onChange={(e) => updateConfig("width", e.target.value)}
                        placeholder="1200"
                      />
                    </div>
                    <div>
                      <Label className="text-teal-600 font-medium">Height in px *</Label>
                      <Input
                        value={config.height}
                        onChange={(e) => updateConfig("height", e.target.value)}
                        placeholder="600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-teal-600 font-medium">Error Z-Index *</Label>
                    <Input
                      value={config.errorZIndex}
                      onChange={(e) => updateConfig("errorZIndex", e.target.value)}
                      placeholder="1"
                      className="w-full md:w-1/3"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="wrapCard">Wrap Into Card</Label>
                      <Switch
                        id="wrapCard"
                        checked={config.wrapIntoCard}
                        onCheckedChange={(checked) => updateConfig("wrapIntoCard", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableScrollable">Enable Scrollable Chart Container</Label>
                      <Switch
                        id="enableScrollable"
                        checked={config.enableScrollable}
                        onCheckedChange={(checked) => updateConfig("enableScrollable", checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Hide Widget Elements */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Show Widget Elements</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.showSettingIcon}
                        onChange={(e) => updateConfig("showSettingIcon", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Setting Icon</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.showExportIcon}
                        onChange={(e) => updateConfig("showExportIcon", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Export Icon</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.showChartTitle}
                        onChange={(e) => updateConfig("showChartTitle", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Chart Title</span>
                    </label>
                  </div>
                </div>

                {/* Chart Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Chart Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorPicker
                      value={config.barColor}
                      onChange={(color) => updateConfig("barColor", color)}
                      label="Bar Color"
                    />
                    <ColorPicker
                      value={config.lineColor}
                      onChange={(color) => updateConfig("lineColor", color)}
                      label="Line Color"
                    />
                  </div>
                </div>

                {/* Advance Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Advance Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="advanceSettings">Advance Settings</Label>
                      <Switch
                        id="advanceSettings"
                        checked={config.advanceSettings}
                        onCheckedChange={(checked) => updateConfig("advanceSettings", checked)}
                      />
                    </div>

                    {config.advanceSettings && (
                      <div className="space-y-6 pl-4 border-l-2 border-teal-200">
                        {/* Chart Font Style */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-teal-600 font-medium">Chart Font Style *</Label>
                            <Select
                              value={config.chartFontStyle}
                              onValueChange={(value) => updateConfig("chartFontStyle", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Noto Sans">Noto Sans</SelectItem>
                                <SelectItem value="Arial">Arial</SelectItem>
                                <SelectItem value="Helvetica">Helvetica</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-teal-600 font-medium">Font Size *</Label>
                            <Input
                              value={config.fontSize}
                              onChange={(e) => updateConfig("fontSize", e.target.value)}
                              placeholder="14"
                            />
                          </div>
                          <ColorPicker
                            value={config.backgroundColor}
                            onChange={(color) => updateConfig("backgroundColor", color)}
                            label="Background Color"
                          />
                        </div>

                        {/* Border Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ColorPicker
                            value={config.borderColor}
                            onChange={(color) => updateConfig("borderColor", color)}
                            label="Border Color"
                          />
                          <div>
                            <Label className="text-teal-600 font-medium">Border Radius in px *</Label>
                            <Input
                              value={config.borderRadius}
                              onChange={(e) => updateConfig("borderRadius", e.target.value)}
                              placeholder="12"
                            />
                          </div>
                        </div>

                        {/* Axis Label & Text Color */}
                        <div>
                          <h4 className="font-semibold mb-4">Axis Label & Text Color</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ColorPicker
                              value={config.yAxisLabelFontColor}
                              onChange={(color) => updateConfig("yAxisLabelFontColor", color)}
                              label="Y Axis Label Font Color"
                            />
                            <ColorPicker
                              value={config.xAxisLabelFontColor}
                              onChange={(color) => updateConfig("xAxisLabelFontColor", color)}
                              label="X Axis Label Font Color"
                            />
                            <ColorPicker
                              value={config.yAxisTextColor}
                              onChange={(color) => updateConfig("yAxisTextColor", color)}
                              label="Y Axis Text Color"
                            />
                            <ColorPicker
                              value={config.xAxisTextColor}
                              onChange={(color) => updateConfig("xAxisTextColor", color)}
                              label="X Axis Text Color"
                            />
                          </div>
                        </div>

                        {/* Axis Color */}
                        <div>
                          <h4 className="font-semibold mb-4">Axis Color</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ColorPicker
                              value={config.yAxisColor}
                              onChange={(color) => updateConfig("yAxisColor", color)}
                              label="Y Axis Color"
                            />
                            <ColorPicker
                              value={config.xAxisColor}
                              onChange={(color) => updateConfig("xAxisColor", color)}
                              label="X Axis Color"
                            />
                          </div>
                        </div>

                        {/* Chart Title */}
                        <div>
                          <h4 className="font-semibold mb-4">Chart Title</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-teal-600 font-medium">Font Size *</Label>
                              <Input
                                value={config.titleFontSize}
                                onChange={(e) => updateConfig("titleFontSize", e.target.value)}
                                placeholder="24"
                              />
                            </div>
                            <div>
                              <Label className="text-teal-600 font-medium">Font Weight *</Label>
                              <Select
                                value={config.titleFontWeight}
                                onValueChange={(value) => updateConfig("titleFontWeight", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Normal">Normal</SelectItem>
                                  <SelectItem value="Bold">Bold</SelectItem>
                                  <SelectItem value="Light">Light</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <ColorPicker
                              value={config.titleFontColor}
                              onChange={(color) => updateConfig("titleFontColor", color)}
                              label="Font Color"
                            />
                          </div>
                        </div>

                        {/* Other */}
                        <div>
                          <h4 className="font-semibold mb-4">Other</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ColorPicker
                              value={config.gridLineColor}
                              onChange={(color) => updateConfig("gridLineColor", color)}
                              label="Grid Line Color"
                            />
                            <ColorPicker
                              value={config.legendTextColor}
                              onChange={(color) => updateConfig("legendTextColor", color)}
                              label="Legend Text Color"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              {activeTab === "data" && <Button onClick={handleNext}>Next</Button>}
              {activeTab === "time" && <Button onClick={handleNext}>Next</Button>}
              {activeTab === "style" && (
                <>
                  <Button variant="outline" onClick={() => setShowPreview(true)}>
                    Preview
                  </Button>
                  <Button onClick={handleUpdateWidget}>Update Widget</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
