"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Truck, TrendingUp, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DispatchLog() {
  const { toast } = useToast()
  const [dispatches, setDispatches] = useState([
    {
      id: 1,
      date: "2024-01-16",
      product: "Product Alpha",
      quantity: 25,
      channel: "Amazon",
      revenue: 12500,
      orderNo: "AMZ-001",
      status: "Shipped",
    },
    {
      id: 2,
      date: "2024-01-16",
      product: "Product Beta",
      quantity: 15,
      channel: "Website",
      revenue: 9000,
      orderNo: "WEB-002",
      status: "Packed",
    },
    {
      id: 3,
      date: "2024-01-15",
      product: "Product Gamma",
      quantity: 30,
      channel: "Flipkart",
      revenue: 18000,
      orderNo: "FK-003",
      status: "Delivered",
    },
    {
      id: 4,
      date: "2024-01-15",
      product: "Product Alpha",
      quantity: 20,
      channel: "1MG",
      revenue: 10000,
      orderNo: "1MG-004",
      status: "Shipped",
    },
  ])

  const [newDispatch, setNewDispatch] = useState({
    product: "",
    quantity: "",
    channel: "",
    revenue: "",
    orderNo: "",
  })

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddDispatch = (e) => {
    e.preventDefault()

    if (!newDispatch.product || !newDispatch.quantity || !newDispatch.channel) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Generate automatic order number if not provided
    const orderNo =
      newDispatch.orderNo ||
      `${newDispatch.channel.substring(0, 3).toUpperCase()}-${String(dispatches.length + 1).padStart(3, "0")}`

    // Calculate revenue if not provided (dummy calculation)
    const revenue = Number.parseInt(newDispatch.revenue) || Number.parseInt(newDispatch.quantity) * 500 // Default ₹500 per unit

    const dispatch = {
      id: dispatches.length + 1,
      date: new Date().toISOString().split("T")[0],
      product: newDispatch.product,
      quantity: Number.parseInt(newDispatch.quantity),
      channel: newDispatch.channel,
      revenue: revenue,
      orderNo: orderNo,
      status: "Packed",
    }

    setDispatches([...dispatches, dispatch])
    setNewDispatch({ product: "", quantity: "", channel: "", revenue: "", orderNo: "" })
    setDialogOpen(false)

    toast({
      title: "Success",
      description: `Dispatch created for ${newDispatch.quantity} units of ${newDispatch.product}`,
    })
  }

  const getChannelStats = () => {
    const stats = {}
    dispatches.forEach((dispatch) => {
      if (!stats[dispatch.channel]) {
        stats[dispatch.channel] = { orders: 0, revenue: 0 }
      }
      stats[dispatch.channel].orders += 1
      stats[dispatch.channel].revenue += dispatch.revenue
    })
    return stats
  }

  const getTodayDispatches = () => {
    const today = new Date().toISOString().split("T")[0]
    return dispatches.filter((d) => d.date === today).length
  }

  const getTotalRevenue = () => {
    return dispatches.reduce((sum, dispatch) => sum + dispatch.revenue, 0)
  }

  const channelStats = getChannelStats()

  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 hero-pattern"></div>

      <header className="relative z-10 flex h-20 shrink-0 items-center gap-2 border-b border-white/20 bg-white/80 backdrop-blur-sm px-6">
        <SidebarTrigger className="-ml-1 hover:bg-blue-100 transition-colors duration-200" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Dispatch Management
              </h1>
              <p className="text-sm text-dark-secondary font-semibold">
                Track daily dispatches and channel-wise performance
              </p>
            </div>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Dispatch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Dispatch</DialogTitle>
              <DialogDescription>Log a new product dispatch</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDispatch} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="product">Product</Label>
                <Select
                  value={newDispatch.product}
                  onValueChange={(value) => setNewDispatch({ ...newDispatch, product: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product Alpha">Product Alpha</SelectItem>
                    <SelectItem value="Product Beta">Product Beta</SelectItem>
                    <SelectItem value="Product Gamma">Product Gamma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newDispatch.quantity}
                    onChange={(e) => setNewDispatch({ ...newDispatch, quantity: e.target.value })}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="channel">Sales Channel</Label>
                  <Select
                    value={newDispatch.channel}
                    onValueChange={(value) => setNewDispatch({ ...newDispatch, channel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Amazon">Amazon</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Flipkart">Flipkart</SelectItem>
                      <SelectItem value="1MG">1MG</SelectItem>
                      <SelectItem value="Telecalling">Telecalling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="revenue">Revenue (₹)</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={newDispatch.revenue}
                  onChange={(e) => setNewDispatch({ ...newDispatch, revenue: e.target.value })}
                  placeholder="Enter revenue amount"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="orderNo">Order Number</Label>
                <Input
                  id="orderNo"
                  value={newDispatch.orderNo}
                  onChange={(e) => setNewDispatch({ ...newDispatch, orderNo: e.target.value })}
                  placeholder="Enter order number"
                />
              </div>
              <Button type="submit" className="w-full">
                Create Dispatch
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dispatches</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dispatches.length}</div>
              <p className="text-xs text-muted-foreground">All time dispatches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Dispatches</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTodayDispatches()}</div>
              <p className="text-xs text-muted-foreground">Orders shipped today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{getTotalRevenue().toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From all dispatches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Channels</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(channelStats).length}</div>
              <p className="text-xs text-muted-foreground">Sales channels</p>
            </CardContent>
          </Card>
        </div>

        {/* Channel Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
            <CardDescription>Revenue breakdown by sales channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(channelStats).map(([channel, stats]) => (
                <div key={channel} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{channel}</h3>
                  <p className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{stats.orders} orders</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dispatch Log Table */}
        <Card>
          <CardHeader>
            <CardTitle>Dispatch Log</CardTitle>
            <CardDescription>Recent dispatch entries and order details</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Date</TableHead>
                  <TableHead className="text-left">Product</TableHead>
                  <TableHead className="text-left">Quantity</TableHead>
                  <TableHead className="text-left">Channel</TableHead>
                  <TableHead className="text-left">Revenue</TableHead>
                  <TableHead className="text-left">Order No.</TableHead>
                  <TableHead className="text-left">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dispatches.map((dispatch) => (
                  <TableRow key={dispatch.id}>
                    <TableCell className="font-medium">{dispatch.date}</TableCell>
                    <TableCell className="font-medium">{dispatch.product}</TableCell>
                    <TableCell className="font-medium">{dispatch.quantity} units</TableCell>
                    <TableCell className="font-medium">{dispatch.channel}</TableCell>
                    <TableCell className="font-medium">₹{dispatch.revenue.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{dispatch.orderNo}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          dispatch.status === "Delivered"
                            ? "default"
                            : dispatch.status === "Shipped"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {dispatch.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
