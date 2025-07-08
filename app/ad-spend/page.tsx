"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { toast } from "@/hooks/use-toast"
import { AdSpendService } from "@/lib/database"
import { useAuth } from "@/components/auth-provider"
import { isSupabaseConfigured } from "@/lib/supabase"
import {
  Plus,
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
  CheckCircle,
  Database,
} from "lucide-react"

interface AdSpend {
  id: string
  user_id: string
  date: string
  platform: "Meta" | "Google Ads" | "Amazon Ads"
  amount: number
  campaign: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export default function AdSpendPage() {
  const { user } = useAuth()
  const [adSpends, setAdSpends] = useState<AdSpend[]>([
    {
      id: "1",
      user_id: "demo",
      date: "2024-01-15",
      platform: "Meta",
      amount: 1500,
      campaign: "Winter Sale Campaign",
      notes: "High performing campaign with good ROAS",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      user_id: "demo",
      date: "2024-01-16",
      platform: "Google Ads",
      amount: 2200,
      campaign: "Search Campaign - Electronics",
      notes: "Good conversion rate on electronics keywords",
      created_at: "2024-01-16T10:00:00Z",
      updated_at: "2024-01-16T10:00:00Z",
    },
    {
      id: "3",
      user_id: "demo",
      date: "2024-01-17",
      platform: "Amazon Ads",
      amount: 800,
      campaign: "Product Listing Ads",
      notes: "Boosting product visibility",
      created_at: "2024-01-17T10:00:00Z",
      updated_at: "2024-01-17T10:00:00Z",
    },
  ])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSpend, setEditingSpend] = useState<AdSpend | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const configured = isSupabaseConfigured()

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    platform: "" as "Meta" | "Google Ads" | "Amazon Ads",
    amount: "",
    campaign: "",
    notes: "",
  })

  useEffect(() => {
    if (user && configured) {
      loadAdSpends()
    }
  }, [user, configured])

  const loadAdSpends = async () => {
    try {
      setLoading(true)
      const data = await AdSpendService.getAll(user?.id || "")
      setAdSpends(data)
    } catch (error) {
      console.error("Error loading ad spends:", error)
      toast({
        title: "Error",
        description: "Failed to load ad spend data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.platform || !formData.amount || !formData.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const spendData = {
        id: editingSpend?.id || Date.now().toString(),
        user_id: user?.id || "demo",
        date: formData.date,
        platform: formData.platform,
        amount: Number.parseFloat(formData.amount),
        campaign: formData.campaign || null,
        notes: formData.notes || null,
        created_at: editingSpend?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (editingSpend) {
        setAdSpends((prev) => prev.map((spend) => (spend.id === editingSpend.id ? spendData : spend)))
        toast({
          title: "Success",
          description: "Ad spend updated successfully",
        })
      } else {
        setAdSpends((prev) => [spendData, ...prev])
        toast({
          title: "Success",
          description: "Ad spend added successfully",
        })
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving ad spend:", error)
      toast({
        title: "Error",
        description: "Failed to save ad spend",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (spend: AdSpend) => {
    setEditingSpend(spend)
    setFormData({
      date: spend.date,
      platform: spend.platform,
      amount: spend.amount.toString(),
      campaign: spend.campaign || "",
      notes: spend.notes || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad spend record?")) return

    try {
      setAdSpends((prev) => prev.filter((spend) => spend.id !== id))
      toast({
        title: "Success",
        description: "Ad spend deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting ad spend:", error)
      toast({
        title: "Error",
        description: "Failed to delete ad spend",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      platform: "" as "Meta" | "Google Ads" | "Amazon Ads",
      amount: "",
      campaign: "",
      notes: "",
    })
    setEditingSpend(null)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  // Filter and search logic
  const filteredSpends = adSpends.filter((spend) => {
    const matchesSearch =
      spend.campaign?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spend.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spend.notes?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPlatform = platformFilter === "all" || spend.platform === platformFilter

    const matchesDate =
      dateFilter === "all" ||
      (() => {
        const spendDate = new Date(spend.date)
        const now = new Date()
        switch (dateFilter) {
          case "today":
            return spendDate.toDateString() === now.toDateString()
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return spendDate >= weekAgo
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return spendDate >= monthAgo
          default:
            return true
        }
      })()

    return matchesSearch && matchesPlatform && matchesDate
  })

  // Analytics calculations
  const totalSpend = filteredSpends.reduce((sum, spend) => sum + spend.amount, 0)
  const platformBreakdown = filteredSpends.reduce(
    (acc, spend) => {
      acc[spend.platform] = (acc[spend.platform] || 0) + spend.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const avgDailySpend = filteredSpends.length > 0 ? totalSpend / filteredSpends.length : 0

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Ad Spend Tracker</h1>
          <p className="text-sm text-muted-foreground">Track advertising spend across platforms</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={configured ? "default" : "secondary"}>
            {configured ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Live Data
              </>
            ) : (
              <>
                <Database className="w-3 h-3 mr-1" />
                Demo Mode
              </>
            )}
          </Badge>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Ad Spend
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingSpend ? "Edit Ad Spend" : "Add Ad Spend"}</DialogTitle>
                <DialogDescription>
                  {editingSpend ? "Update the ad spend details." : "Add a new ad spend record."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="amount">Amount (₹) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform *</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value: "Meta" | "Google Ads" | "Amazon Ads") =>
                      setFormData((prev) => ({ ...prev, platform: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Meta">Meta (Facebook/Instagram)</SelectItem>
                      <SelectItem value="Google Ads">Google Ads</SelectItem>
                      <SelectItem value="Amazon Ads">Amazon Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign">Campaign Name</Label>
                  <Input
                    id="campaign"
                    value={formData.campaign}
                    onChange={(e) => setFormData((prev) => ({ ...prev, campaign: e.target.value }))}
                    placeholder="Optional campaign name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingSpend ? "Update" : "Add"} Ad Spend</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {!configured && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You're viewing demo data. Configure Supabase to enable real data persistence.
            </AlertDescription>
          </Alert>
        )}

        {/* Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSpend.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all platforms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredSpends.length}</div>
              <p className="text-xs text-muted-foreground">Active campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Daily</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{avgDailySpend.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Average per day</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(platformBreakdown).length > 0
                  ? Object.entries(platformBreakdown).sort(([, a], [, b]) => b - a)[0][0]
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Highest spend</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search campaigns, platforms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="platform-filter">Platform</Label>
                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="Meta">Meta</SelectItem>
                        <SelectItem value="Google Ads">Google Ads</SelectItem>
                        <SelectItem value="Amazon Ads">Amazon Ads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date-filter">Date Range</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Ad Spend Records</CardTitle>
                <CardDescription>{filteredSpends.length} records found</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : filteredSpends.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No ad spend records found.</p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Record
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Campaign</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSpends.map((spend) => (
                          <TableRow key={spend.id}>
                            <TableCell>{new Date(spend.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{spend.platform}</Badge>
                            </TableCell>
                            <TableCell>{spend.campaign || "—"}</TableCell>
                            <TableCell className="text-right font-medium">₹{spend.amount.toLocaleString()}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{spend.notes || "—"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(spend)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(spend.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Platform Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Breakdown</CardTitle>
                <CardDescription>Ad spend distribution across platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(platformBreakdown).map(([platform, amount]) => (
                  <div key={platform} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{platform}</span>
                      <span>₹{amount.toLocaleString()}</span>
                    </div>
                    <Progress value={(amount / totalSpend) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {((amount / totalSpend) * 100).toFixed(1)}% of total spend
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
