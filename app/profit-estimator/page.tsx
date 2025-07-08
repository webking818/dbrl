"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Download, Plus, TrendingUp, TrendingDown, DollarSign, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ProfitEstimatorService } from "@/lib/database"
import { useAuth } from "@/components/auth-provider"

interface ProfitData {
  id: string
  user_id: string
  date: string
  revenue: number
  ad_spend: number
  shipping: number
  cogs: number
  other_expenses: number
  estimated_profit: number
  created_at: string
  updated_at: string
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#10B981",
  },
  expenses: {
    label: "Total Expenses",
    color: "#EF4444",
  },
  profit: {
    label: "Estimated Profit",
    color: "#8B5CF6",
  },
}

export default function ProfitEstimator() {
  const [profitData, setProfitData] = useState<ProfitData[]>([
    {
      id: "1",
      user_id: "demo",
      date: "2024-01-16",
      revenue: 45000,
      ad_spend: 8000,
      shipping: 3200,
      cogs: 22000,
      other_expenses: 1500,
      estimated_profit: 10300,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "demo",
      date: "2024-01-15",
      revenue: 38000,
      ad_spend: 6500,
      shipping: 2800,
      cogs: 19000,
      other_expenses: 1200,
      estimated_profit: 8500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    revenue: "",
    ad_spend: "",
    shipping: "",
    cogs: "",
    other_expenses: "",
  })

  const { toast } = useToast()
  const { user } = useAuth()

  // Load data from database
  useEffect(() => {
    loadProfitData()
  }, [user])

  const loadProfitData = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const data = await ProfitEstimatorService.getAll(user.id)
      setProfitData(data as ProfitData[])
    } catch (error) {
      console.error("Error loading profit data:", error)
      toast({
        title: "Error",
        description: "Failed to load profit data",
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

    if (!formData.date || !formData.revenue) {
      toast({
        title: "Error",
        description: "Please fill in date and revenue at minimum",
        variant: "destructive",
      })
      return
    }

    const revenue = Number.parseFloat(formData.revenue) || 0
    const adSpend = Number.parseFloat(formData.ad_spend) || 0
    const shipping = Number.parseFloat(formData.shipping) || 0
    const cogs = Number.parseFloat(formData.cogs) || 0
    const otherExpenses = Number.parseFloat(formData.other_expenses) || 0

    if (revenue <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid revenue amount",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await ProfitEstimatorService.create({
        user_id: user.id,
        date: formData.date,
        revenue: revenue,
        ad_spend: adSpend,
        shipping: shipping,
        cogs: cogs,
        other_expenses: otherExpenses,
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to add profit data",
          variant: "destructive",
        })
        return
      }

      // Reload data
      await loadProfitData()

      setFormData({
        date: new Date().toISOString().split("T")[0],
        revenue: "",
        ad_spend: "",
        shipping: "",
        cogs: "",
        other_expenses: "",
      })
      setIsDialogOpen(false)

      const estimatedProfit = revenue - (adSpend + shipping + cogs + otherExpenses)
      toast({
        title: "Success",
        description: `Profit estimate added: ${estimatedProfit >= 0 ? "Profit" : "Loss"} of ₹${Math.abs(estimatedProfit).toLocaleString()}`,
      })
    } catch (error) {
      console.error("Error adding profit data:", error)
      toast({
        title: "Error",
        description: "Failed to add profit data",
        variant: "destructive",
      })
    }
  }

  const exportData = () => {
    const csvContent = [
      ["Date", "Revenue", "Ad Spend", "Shipping", "COGS", "Other Expenses", "Estimated Profit"],
      ...profitData.map((item) => [
        item.date,
        item.revenue.toString(),
        item.ad_spend.toString(),
        item.shipping.toString(),
        item.cogs.toString(),
        item.other_expenses.toString(),
        item.estimated_profit.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `profit-estimates-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Profit estimates exported successfully",
    })
  }

  // Calculate summary metrics
  const totalRevenue = profitData.reduce((sum, item) => sum + item.revenue, 0)
  const totalExpenses = profitData.reduce(
    (sum, item) => sum + (item.ad_spend + item.shipping + item.cogs + item.other_expenses),
    0,
  )
  const totalProfit = profitData.reduce((sum, item) => sum + item.estimated_profit, 0)
  const profitableDays = profitData.filter((item) => item.estimated_profit > 0).length
  const avgDailyProfit = profitData.length > 0 ? totalProfit / profitData.length : 0

  // Chart data
  const chartData = profitData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => ({
      date: item.date,
      revenue: item.revenue,
      expenses: item.ad_spend + item.shipping + item.cogs + item.other_expenses,
      profit: item.estimated_profit,
    }))

  const getProfitStatus = (profit: number) => {
    if (profit > 10000) return { label: "Excellent", variant: "default" as const }
    if (profit > 5000) return { label: "Good", variant: "default" as const }
    if (profit > 0) return { label: "Profitable", variant: "secondary" as const }
    if (profit > -5000) return { label: "Minor Loss", variant: "destructive" as const }
    return { label: "Major Loss", variant: "destructive" as const }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading profit data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Profit Estimator
            </h1>
            <p className="text-slate-600 mt-2">Track daily profit/loss with comprehensive expense analysis</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportData} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 gap-2"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Daily Data
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Daily Profit Data</DialogTitle>
                  <DialogDescription>
                    Enter daily revenue and expenses to calculate estimated profit/loss
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Daily Revenue (₹) *</Label>
                    <Input
                      id="revenue"
                      type="number"
                      step="0.01"
                      placeholder="Enter total revenue"
                      value={formData.revenue}
                      onChange={(e) => setFormData((prev) => ({ ...prev, revenue: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="shipping">Shipping (₹)</Label>
                      <Input
                        id="shipping"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={formData.shipping}
                        onChange={(e) => setFormData((prev) => ({ ...prev, shipping: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="other_expenses">Other Expenses (₹)</Label>
                      <Input
                        id="other_expenses"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={formData.other_expenses}
                        onChange={(e) => setFormData((prev) => ({ ...prev, other_expenses: e.target.value }))}
                      />
                    </div>
                  </div>
                  {formData.revenue && (
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <div className="text-sm text-slate-600">Estimated Profit/Loss:</div>
                      <div
                        className={`text-lg font-bold ${
                          (Number.parseFloat(formData.revenue) || 0) -
                            ((Number.parseFloat(formData.ad_spend) || 0) +
                              (Number.parseFloat(formData.shipping) || 0) +
                              (Number.parseFloat(formData.cogs) || 0) +
                              (Number.parseFloat(formData.other_expenses) || 0)) >=
                          0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ₹
                        {(
                          (Number.parseFloat(formData.revenue) || 0) -
                          ((Number.parseFloat(formData.ad_spend) || 0) +
                            (Number.parseFloat(formData.shipping) || 0) +
                            (Number.parseFloat(formData.cogs) || 0) +
                            (Number.parseFloat(formData.other_expenses) || 0))
                        ).toLocaleString()}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-orange-600 to-red-600">
                      Add Entry
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalProfit.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs opacity-90 mt-1">
                {totalProfit >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {totalProfit >= 0 ? "Profitable" : "Loss"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">₹{totalRevenue.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <DollarSign className="h-3 w-3" />
                Income generated
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">₹{totalExpenses.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <TrendingDown className="h-3 w-3" />
                All costs combined
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Profitable Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {profitableDays}/{profitData.length}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <Calculator className="h-3 w-3" />
                {profitData.length > 0 ? ((profitableDays / profitData.length) * 100).toFixed(0) : 0}% success rate
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Daily Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${avgDailyProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{avgDailyProfit.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                {avgDailyProfit >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                Per day average
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle>Profit Trend</CardTitle>
              <CardDescription>Daily profit/loss over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="profit" stroke="#8B5CF6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Daily income and cost breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="#10B981" />
                    <Bar dataKey="expenses" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle>Daily Profit/Loss Records</CardTitle>
            <CardDescription>Detailed breakdown of daily financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Ad Spend</TableHead>
                    <TableHead className="text-right">Shipping</TableHead>
                    <TableHead className="text-right">COGS</TableHead>
                    <TableHead className="text-right">Other</TableHead>
                    <TableHead className="text-right">Profit/Loss</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profitData.map((item) => {
                    const status = getProfitStatus(item.estimated_profit)
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.date}</TableCell>
                        <TableCell className="text-right font-mono">₹{item.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">₹{item.ad_spend.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">₹{item.shipping.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">₹{item.cogs.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">₹{item.other_expenses.toLocaleString()}</TableCell>
                        <TableCell
                          className={`text-right font-mono font-bold ${
                            item.estimated_profit >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ₹{item.estimated_profit.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
