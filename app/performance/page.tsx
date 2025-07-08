"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, TrendingUp, TrendingDown, DollarSign, Package, RefreshCw, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { PerformanceReportsService } from "@/lib/database"
import { useAuth } from "@/components/auth-provider"

interface PerformanceData {
  id: string
  user_id: string
  product_name: string
  sku: string
  month: string
  sales: number
  returns: number
  ad_spend: number
  cogs: number
  net_margin: number
  units: number
  created_at: string
  updated_at: string
}

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#10B981",
  },
  returns: {
    label: "Returns",
    color: "#EF4444",
  },
  adSpend: {
    label: "Ad Spend",
    color: "#8B5CF6",
  },
  netMargin: {
    label: "Net Margin",
    color: "#F59E0B",
  },
}

export default function PerformanceReports() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([
    {
      id: "1",
      user_id: "demo",
      product_name: "Premium Headphones",
      sku: "PH-001",
      month: "2024-01",
      sales: 85000,
      returns: 4200,
      ad_spend: 12000,
      cogs: 42000,
      net_margin: 26800,
      units: 170,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "demo",
      product_name: "Wireless Mouse",
      sku: "WM-002",
      month: "2024-01",
      sales: 32000,
      returns: 1600,
      ad_spend: 4800,
      cogs: 16000,
      net_margin: 9600,
      units: 160,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    product_name: "",
    sku: "",
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
    sales: "",
    returns: "",
    ad_spend: "",
    cogs: "",
    units: "",
  })

  const { toast } = useToast()
  const { user } = useAuth()

  // Load data from database
  useEffect(() => {
    loadPerformanceData()
  }, [user])

  const loadPerformanceData = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const data = await PerformanceReportsService.getAll(user.id)
      setPerformanceData(data as PerformanceData[])
    } catch (error) {
      console.error("Error loading performance data:", error)
      toast({
        title: "Error",
        description: "Failed to load performance data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please log in to add data",
        variant: "destructive",
      })
      return
    }

    if (!formData.product_name || !formData.sku || !formData.month || !formData.sales || !formData.units) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const sales = Number.parseFloat(formData.sales) || 0
    const returns = Number.parseFloat(formData.returns) || 0
    const adSpend = Number.parseFloat(formData.ad_spend) || 0
    const cogs = Number.parseFloat(formData.cogs) || 0
    const units = Number.parseInt(formData.units) || 0

    if (sales <= 0 || units <= 0) {
      toast({
        title: "Error",
        description: "Sales and units must be greater than 0",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await PerformanceReportsService.create({
        user_id: user.id,
        product_name: formData.product_name,
        sku: formData.sku,
        month: formData.month,
        sales: sales,
        returns: returns,
        ad_spend: adSpend,
        cogs: cogs,
        units: units,
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to add performance data",
          variant: "destructive",
        })
        return
      }

      // Reload data
      await loadPerformanceData()

      setFormData({
        product_name: "",
        sku: "",
        month: new Date().toISOString().slice(0, 7),
        sales: "",
        returns: "",
        ad_spend: "",
        cogs: "",
        units: "",
      })
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Performance data added successfully",
      })
    } catch (error) {
      console.error("Error adding performance data:", error)
      toast({
        title: "Error",
        description: "Failed to add performance data",
        variant: "destructive",
      })
    }
  }

  const filteredData = performanceData.filter((item) => {
    const monthMatch = selectedMonth === "all" || item.month === selectedMonth
    const productMatch = selectedProduct === "all" || item.sku === selectedProduct
    return monthMatch && productMatch
  })

  const exportData = () => {
    const csvContent = [
      ["Product Name", "SKU", "Month", "Sales", "Returns", "Ad Spend", "COGS", "Net Margin", "Units"],
      ...filteredData.map((item) => [
        item.product_name,
        item.sku,
        item.month,
        item.sales.toString(),
        item.returns.toString(),
        item.ad_spend.toString(),
        item.cogs.toString(),
        item.net_margin.toString(),
        item.units.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `performance-report-${selectedMonth}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Performance report exported successfully",
    })
  }

  // Calculate summary metrics
  const totalSales = filteredData.reduce((sum, item) => sum + item.sales, 0)
  const totalReturns = filteredData.reduce((sum, item) => sum + item.returns, 0)
  const totalAdSpend = filteredData.reduce((sum, item) => sum + item.ad_spend, 0)
  const totalNetMargin = filteredData.reduce((sum, item) => sum + item.net_margin, 0)
  const returnRate = totalSales > 0 ? (totalReturns / totalSales) * 100 : 0

  // Best and worst performers
  const bestPerformer =
    filteredData.length > 0
      ? filteredData.reduce((best, current) => (current.net_margin > best.net_margin ? current : best), filteredData[0])
      : null
  const worstPerformer =
    filteredData.length > 0
      ? filteredData.reduce(
          (worst, current) => (current.net_margin < worst.net_margin ? current : worst),
          filteredData[0],
        )
      : null

  // Chart data
  const chartData = filteredData.map((item) => ({
    name: item.sku,
    sales: item.sales,
    returns: item.returns,
    adSpend: item.ad_spend,
    netMargin: item.net_margin,
  }))

  const uniqueProducts = [...new Set(performanceData.map((item) => item.sku))]
  const uniqueMonths = [...new Set(performanceData.map((item) => item.month))].sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading performance data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Performance Reports
            </h1>
            <p className="text-slate-600 mt-2">Product-wise monthly performance analysis</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportData} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Performance Data
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Performance Data</DialogTitle>
                  <DialogDescription>Record monthly product performance metrics</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Product Name *</Label>
                    <Input
                      id="product_name"
                      placeholder="Enter product name"
                      value={formData.product_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, product_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      placeholder="Enter SKU"
                      value={formData.sku}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month">Month *</Label>
                    <Input
                      id="month"
                      type="month"
                      value={formData.month}
                      onChange={(e) => setFormData((prev) => ({ ...prev, month: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sales">Sales (₹) *</Label>
                      <Input
                        id="sales"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={formData.sales}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sales: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="units">Units Sold *</Label>
                      <Input
                        id="units"
                        type="number"
                        placeholder="0"
                        value={formData.units}
                        onChange={(e) => setFormData((prev) => ({ ...prev, units: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="returns">Returns (₹)</Label>
                      <Input
                        id="returns"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={formData.returns}
                        onChange={(e) => setFormData((prev) => ({ ...prev, returns: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ad_spend">Ad Spend (₹)</Label>
                      <Input
                        id="ad_spend"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={formData.ad_spend}
                        onChange={(e) => setFormData((prev) => ({ ...prev, ad_spend: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cogs">COGS (₹)</Label>
                    <Input
                      id="cogs"
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={formData.cogs}
                      onChange={(e) => setFormData((prev) => ({ ...prev, cogs: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600">
                      Add Entry
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {uniqueMonths.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    {uniqueProducts.map((sku) => (
                      <SelectItem key={sku} value={sku}>
                        {sku}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSales.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs opacity-90 mt-1">
                <TrendingUp className="h-3 w-3" />
                Revenue generated
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Net Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">₹{totalNetMargin.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <DollarSign className="h-3 w-3" />
                {totalSales > 0 ? ((totalNetMargin / totalSales) * 100).toFixed(1) : 0}% margin
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Ad Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">₹{totalAdSpend.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <TrendingUp className="h-3 w-3" />
                Marketing investment
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">₹{totalReturns.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <RefreshCw className="h-3 w-3" />
                {returnRate.toFixed(1)}% return rate
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{filteredData.length}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <Package className="h-3 w-3" />
                Active SKUs
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Highlights */}
        {bestPerformer && worstPerformer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Best Performer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-semibold text-green-900">{bestPerformer.product_name}</div>
                  <div className="text-sm text-green-700">SKU: {bestPerformer.sku}</div>
                  <div className="text-2xl font-bold text-green-800">₹{bestPerformer.net_margin.toLocaleString()}</div>
                  <div className="text-sm text-green-600">Net margin for {bestPerformer.month}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-100 to-rose-100 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-semibold text-red-900">{worstPerformer.product_name}</div>
                  <div className="text-sm text-red-700">SKU: {worstPerformer.sku}</div>
                  <div className="text-2xl font-bold text-red-800">₹{worstPerformer.net_margin.toLocaleString()}</div>
                  <div className="text-sm text-red-600">Net margin for {worstPerformer.month}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle>Sales vs Returns</CardTitle>
              <CardDescription>Product performance comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="#10B981" />
                    <Bar dataKey="returns" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle>Net Margin Analysis</CardTitle>
              <CardDescription>Profitability by product</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="netMargin" stroke="#F59E0B" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle>Detailed Performance Data</CardTitle>
            <CardDescription>Complete product performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Returns</TableHead>
                    <TableHead className="text-right">Ad Spend</TableHead>
                    <TableHead className="text-right">Net Margin</TableHead>
                    <TableHead className="text-right">Units</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product_name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.month}</TableCell>
                      <TableCell className="text-right font-mono">₹{item.sales.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">₹{item.returns.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">₹{item.ad_spend.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">₹{item.net_margin.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.units}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.net_margin > 20000 ? "default" : item.net_margin > 10000 ? "secondary" : "destructive"
                          }
                        >
                          {item.net_margin > 20000 ? "Excellent" : item.net_margin > 10000 ? "Good" : "Needs Attention"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
