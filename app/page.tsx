"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  PieChart,
  Calculator,
  Phone,
  Info,
} from "lucide-react"
import Link from "next/link"
import { DatabaseService } from "@/lib/database"
import { isSupabaseConfigured } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

interface DashboardData {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  totalProducts: number
  lowStockItems: number
  totalStaff: number
  presentToday: number
  pendingPayroll: number
  recentActivities: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    status: "success" | "warning" | "error"
  }>
  monthlyPerformance: Array<{
    month: string
    revenue: number
    expenses: number
    profit: number
  }>
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabaseConnected = isSupabaseConfigured()

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      if (supabaseConnected && user) {
        // Use real Supabase data
        const analytics = await DatabaseService.getDashboardAnalytics(user.id)
        setData({
          totalRevenue: analytics.totalRevenue || 0,
          totalExpenses: analytics.totalExpenses || 0,
          netProfit: analytics.totalProfit || 0,
          totalProducts: 156, // This would come from products table
          lowStockItems: 12, // This would come from inventory analysis
          totalStaff: 24, // This would come from staff table
          presentToday: 22, // This would come from attendance table
          pendingPayroll: 3, // This would come from payroll table
          recentActivities: analytics.recentActivity || [],
          monthlyPerformance: [
            { month: "Jan", revenue: 120000, expenses: 80000, profit: 40000 },
            { month: "Feb", revenue: 135000, expenses: 85000, profit: 50000 },
            {
              month: "Mar",
              revenue: analytics.totalRevenue || 125000,
              expenses: analytics.totalExpenses || 85000,
              profit: analytics.totalProfit || 40000,
            },
          ],
        })
      } else {
        // Use demo data
        setData(getDemoData())
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      // Fallback to demo data on error
      setData(getDemoData())
    } finally {
      setLoading(false)
    }
  }

  const getDemoData = (): DashboardData => {
    return {
      totalRevenue: 125000,
      totalExpenses: 85000,
      netProfit: 40000,
      totalProducts: 156,
      lowStockItems: 12,
      totalStaff: 24,
      presentToday: 22,
      pendingPayroll: 3,
      recentActivities: [
        {
          id: "1",
          type: "sale",
          description: "New order received - ₹15,000",
          timestamp: "2 hours ago",
          status: "success",
        },
        {
          id: "2",
          type: "inventory",
          description: "Low stock alert for Product A",
          timestamp: "4 hours ago",
          status: "warning",
        },
        {
          id: "3",
          type: "staff",
          description: "New employee onboarded",
          timestamp: "1 day ago",
          status: "success",
        },
      ],
      monthlyPerformance: [
        { month: "Jan", revenue: 120000, expenses: 80000, profit: 40000 },
        { month: "Feb", revenue: 135000, expenses: 85000, profit: 50000 },
        { month: "Mar", revenue: 125000, expenses: 85000, profit: 40000 },
      ],
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Supabase Status Alert */}
        {!supabaseConnected && (
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Demo Mode:</strong> You're viewing sample data. Configure Supabase environment variables to enable
              full backend functionality.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              {supabaseConnected ? "Live Data" : "Demo Mode"}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data?.totalRevenue.toLocaleString()}</div>
              <p className="text-xs opacity-90 mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data?.netProfit.toLocaleString()}</div>
              <p className="text-xs opacity-90 mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Products</CardTitle>
              <Package className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalProducts}</div>
              <p className="text-xs opacity-90 mt-1">
                <AlertTriangle className="inline h-3 w-3 mr-1" />
                {data?.lowStockItems} low stock items
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Staff Present</CardTitle>
              <Users className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.presentToday}/{data?.totalStaff}
              </div>
              <p className="text-xs opacity-90 mt-1">
                <CheckCircle className="inline h-3 w-3 mr-1" />
                {Math.round(((data?.presentToday || 0) / (data?.totalStaff || 1)) * 100)}% attendance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Business Intelligence Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-violet-600" />
            <h2 className="text-xl font-semibold text-gray-900">Business Intelligence</h2>
            <Badge variant="secondary" className="bg-violet-100 text-violet-700">
              New
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
                  <Badge className="bg-purple-100 text-purple-700">Analytics</Badge>
                </div>
                <CardTitle className="text-lg">Ad Spend Tracker</CardTitle>
                <CardDescription>Monitor advertising ROI and campaign performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Spend</span>
                    <span className="font-semibold">₹45,230</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ROAS</span>
                    <span className="font-semibold text-green-600">4.2x</span>
                  </div>
                </div>
                <Link href="/ad-spend">
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">View Details</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Phone className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                  <Badge className="bg-blue-100 text-blue-700">Support</Badge>
                </div>
                <CardTitle className="text-lg">Call Center</CardTitle>
                <CardDescription>Manage customer support and call logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Today's Calls</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Response</span>
                    <span className="font-semibold text-green-600">2.3 min</span>
                  </div>
                </div>
                <Link href="/call-center">
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">View Details</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Calculator className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
                  <Badge className="bg-green-100 text-green-700">Finance</Badge>
                </div>
                <CardTitle className="text-lg">Profit Estimator</CardTitle>
                <CardDescription>Calculate margins and forecast profits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gross Margin</span>
                    <span className="font-semibold">32%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Est. Profit</span>
                    <span className="font-semibold text-green-600">₹1,24,500</span>
                  </div>
                </div>
                <Link href="/profit-estimator">
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">View Details</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <PieChart className="h-8 w-8 text-orange-600 group-hover:scale-110 transition-transform" />
                  <Badge className="bg-orange-100 text-orange-700">Reports</Badge>
                </div>
                <CardTitle className="text-lg">Performance Reports</CardTitle>
                <CardDescription>Comprehensive business performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Performance Score</span>
                    <span className="font-semibold">87/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trend</span>
                    <span className="font-semibold text-green-600">↗ +5%</span>
                  </div>
                </div>
                <Link href="/performance">
                  <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                <CardTitle>Recent Activities</CardTitle>
              </div>
              <CardDescription>Latest updates from your business operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === "success"
                          ? "bg-green-500"
                          : activity.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-gray-600" />
                <CardTitle>Quick Actions</CardTitle>
              </div>
              <CardDescription>Frequently used operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link href="/raw-materials">
                  <Button variant="outline" className="w-full justify-start gap-2 h-12">
                    <Package className="h-4 w-4" />
                    Add Raw Material
                  </Button>
                </Link>
                <Link href="/attendance">
                  <Button variant="outline" className="w-full justify-start gap-2 h-12">
                    <Users className="h-4 w-4" />
                    Mark Attendance
                  </Button>
                </Link>
                <Link href="/expenses">
                  <Button variant="outline" className="w-full justify-start gap-2 h-12">
                    <BarChart3 className="h-4 w-4" />
                    Record Expense
                  </Button>
                </Link>
                <Link href="/dispatch">
                  <Button variant="outline" className="w-full justify-start gap-2 h-12">
                    <TrendingUp className="h-4 w-4" />
                    Create Dispatch
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
