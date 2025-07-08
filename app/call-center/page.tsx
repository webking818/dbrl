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
import { Download, Plus, Phone, PhoneCall, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { CallCenterService } from "@/lib/database"
import { useAuth } from "@/components/auth-provider"

interface CallCenterData {
  id: string
  user_id: string
  date: string
  calls_received: number
  calls_answered: number
  ndr_received: number
  ndr_resolved: number
  avg_response_time: number
  notes?: string
  created_at: string
  updated_at: string
}

const chartConfig = {
  received: {
    label: "Calls Received",
    color: "#3B82F6",
  },
  answered: {
    label: "Calls Answered",
    color: "#10B981",
  },
  ndr: {
    label: "NDR Cases",
    color: "#F59E0B",
  },
}

export default function CallCenterTracker() {
  const [callData, setCallData] = useState<CallCenterData[]>([
    {
      id: "1",
      user_id: "demo",
      date: "2024-01-16",
      calls_received: 120,
      calls_answered: 115,
      ndr_received: 18,
      ndr_resolved: 15,
      avg_response_time: 32,
      notes: "Good performance day",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "demo",
      date: "2024-01-15",
      calls_received: 95,
      calls_answered: 88,
      ndr_received: 12,
      ndr_resolved: 10,
      avg_response_time: 28,
      notes: "Lower volume day",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    calls_received: "",
    calls_answered: "",
    ndr_received: "",
    ndr_resolved: "",
    avg_response_time: "",
    notes: "",
  })

  const { toast } = useToast()
  const { user } = useAuth()

  // Load data from database
  useEffect(() => {
    loadCallData()
  }, [user])

  const loadCallData = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const data = await CallCenterService.getAll(user.id)
      setCallData(data as CallCenterData[])
    } catch (error) {
      console.error("Error loading call center data:", error)
      toast({
        title: "Error",
        description: "Failed to load call center data",
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

    if (!formData.date || !formData.calls_received || !formData.calls_answered) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const callsReceived = Number.parseInt(formData.calls_received)
    const callsAnswered = Number.parseInt(formData.calls_answered)
    const ndrReceived = Number.parseInt(formData.ndr_received) || 0
    const ndrResolved = Number.parseInt(formData.ndr_resolved) || 0
    const avgResponseTime = Number.parseFloat(formData.avg_response_time) || 0

    if (callsAnswered > callsReceived) {
      toast({
        title: "Error",
        description: "Calls answered cannot exceed calls received",
        variant: "destructive",
      })
      return
    }

    if (ndrResolved > ndrReceived) {
      toast({
        title: "Error",
        description: "NDR resolved cannot exceed NDR received",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await CallCenterService.create({
        user_id: user.id,
        date: formData.date,
        calls_received: callsReceived,
        calls_answered: callsAnswered,
        ndr_received: ndrReceived,
        ndr_resolved: ndrResolved,
        avg_response_time: avgResponseTime,
        notes: formData.notes || null,
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to add call center data",
          variant: "destructive",
        })
        return
      }

      // Reload data
      await loadCallData()

      setFormData({
        date: new Date().toISOString().split("T")[0],
        calls_received: "",
        calls_answered: "",
        ndr_received: "",
        ndr_resolved: "",
        avg_response_time: "",
        notes: "",
      })
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "Call center data added successfully",
      })
    } catch (error) {
      console.error("Error adding call center data:", error)
      toast({
        title: "Error",
        description: "Failed to add call center data",
        variant: "destructive",
      })
    }
  }

  const exportData = () => {
    const csvContent = [
      ["Date", "Calls Received", "Calls Answered", "NDR Received", "NDR Resolved", "Avg Response Time", "Notes"],
      ...callData.map((item) => [
        item.date,
        item.calls_received.toString(),
        item.calls_answered.toString(),
        item.ndr_received.toString(),
        item.ndr_resolved.toString(),
        item.avg_response_time.toString(),
        item.notes || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `call-center-data-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Call center data exported successfully",
    })
  }

  // Calculate metrics
  const totalCallsReceived = callData.reduce((sum, item) => sum + item.calls_received, 0)
  const totalCallsAnswered = callData.reduce((sum, item) => sum + item.calls_answered, 0)
  const totalNdrReceived = callData.reduce((sum, item) => sum + item.ndr_received, 0)
  const totalNdrResolved = callData.reduce((sum, item) => sum + item.ndr_resolved, 0)

  const answerRate = totalCallsReceived > 0 ? (totalCallsAnswered / totalCallsReceived) * 100 : 0
  const ndrResolutionRate = totalNdrReceived > 0 ? (totalNdrResolved / totalNdrReceived) * 100 : 0
  const avgResponseTime =
    callData.length > 0 ? callData.reduce((sum, item) => sum + item.avg_response_time, 0) / callData.length : 0

  // Chart data
  const chartData = callData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => ({
      date: item.date,
      received: item.calls_received,
      answered: item.calls_answered,
      ndr: item.ndr_received,
    }))

  const pieData = [
    { name: "Answered", value: totalCallsAnswered, color: "#10B981" },
    { name: "Missed", value: totalCallsReceived - totalCallsAnswered, color: "#EF4444" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading call center data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Call Center Tracker
            </h1>
            <p className="text-slate-600 mt-2">Monitor team productivity and customer service metrics</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportData} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 gap-2"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Daily Data
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Call Center Data</DialogTitle>
                  <DialogDescription>Record daily call center performance and NDR tracking</DialogDescription>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="calls_received">Calls Received *</Label>
                      <Input
                        id="calls_received"
                        type="number"
                        placeholder="0"
                        value={formData.calls_received}
                        onChange={(e) => setFormData((prev) => ({ ...prev, calls_received: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="calls_answered">Calls Answered *</Label>
                      <Input
                        id="calls_answered"
                        type="number"
                        placeholder="0"
                        value={formData.calls_answered}
                        onChange={(e) => setFormData((prev) => ({ ...prev, calls_answered: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ndr_received">NDR Received</Label>
                      <Input
                        id="ndr_received"
                        type="number"
                        placeholder="0"
                        value={formData.ndr_received}
                        onChange={(e) => setFormData((prev) => ({ ...prev, ndr_received: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ndr_resolved">NDR Resolved</Label>
                      <Input
                        id="ndr_resolved"
                        type="number"
                        placeholder="0"
                        value={formData.ndr_resolved}
                        onChange={(e) => setFormData((prev) => ({ ...prev, ndr_resolved: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avg_response_time">Avg Response Time (seconds)</Label>
                    <Input
                      id="avg_response_time"
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={formData.avg_response_time}
                      onChange={(e) => setFormData((prev) => ({ ...prev, avg_response_time: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                      id="notes"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Additional notes about the day"
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-600">
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
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Answer Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{answerRate.toFixed(1)}%</div>
              <div className="flex items-center gap-1 text-xs opacity-90 mt-1">
                <PhoneCall className="h-3 w-3" />
                Call efficiency
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{totalCallsReceived.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <Phone className="h-3 w-3" />
                Calls received
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">NDR Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{ndrResolutionRate.toFixed(1)}%</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <CheckCircle className="h-3 w-3" />
                Cases resolved
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{avgResponseTime.toFixed(0)}s</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <Clock className="h-3 w-3" />
                Response time
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">NDR Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{totalNdrReceived}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <AlertTriangle className="h-3 w-3" />
                Total received
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle>Call Volume Trends</CardTitle>
              <CardDescription>Daily call received vs answered</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="received" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="answered" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle>Call Answer Distribution</CardTitle>
              <CardDescription>Overall answered vs missed calls</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle>Daily Call Center Performance</CardTitle>
            <CardDescription>Comprehensive tracking of team productivity and service quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Calls Received</TableHead>
                    <TableHead className="text-right">Calls Answered</TableHead>
                    <TableHead className="text-right">Answer Rate</TableHead>
                    <TableHead className="text-right">NDR Received</TableHead>
                    <TableHead className="text-right">NDR Resolved</TableHead>
                    <TableHead className="text-right">NDR Rate</TableHead>
                    <TableHead className="text-right">Avg Response</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callData.map((item) => {
                    const answerRate = (item.calls_answered / item.calls_received) * 100
                    const ndrRate = item.ndr_received > 0 ? (item.ndr_resolved / item.ndr_received) * 100 : 0
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.date}</TableCell>
                        <TableCell className="text-right">{item.calls_received}</TableCell>
                        <TableCell className="text-right">{item.calls_answered}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={answerRate >= 90 ? "default" : answerRate >= 80 ? "secondary" : "destructive"}
                          >
                            {answerRate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{item.ndr_received}</TableCell>
                        <TableCell className="text-right">{item.ndr_resolved}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={ndrRate >= 80 ? "default" : ndrRate >= 60 ? "secondary" : "destructive"}>
                            {ndrRate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{item.avg_response_time}s</TableCell>
                        <TableCell className="text-slate-600">{item.notes || "-"}</TableCell>
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
