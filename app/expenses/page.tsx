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
import { Plus, BarChart3, TrendingDown, TrendingUp, DollarSign, CreditCard, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Expenses() {
  const { toast } = useToast()
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "2024-01-16",
      category: "Raw Materials",
      description: "Chemical B purchase",
      amount: 25000,
      vendor: "ChemCorp Ltd",
      status: "Paid",
    },
    {
      id: 2,
      date: "2024-01-15",
      category: "Salary",
      description: "Monthly payroll",
      amount: 180000,
      vendor: "Internal",
      status: "Paid",
    },
    {
      id: 3,
      date: "2024-01-14",
      category: "Marketing",
      description: "Digital advertising",
      amount: 15000,
      vendor: "AdTech Solutions",
      status: "Pending",
    },
    {
      id: 4,
      date: "2024-01-13",
      category: "Courier",
      description: "Shipping charges",
      amount: 8500,
      vendor: "FastShip Logistics",
      status: "Paid",
    },
  ])

  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
    vendor: "",
  })

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddExpense = (e) => {
    e.preventDefault()

    if (!newExpense.category || !newExpense.description || !newExpense.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (Number.parseInt(newExpense.amount) <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    const expense = {
      id: expenses.length + 1,
      date: new Date().toISOString().split("T")[0],
      category: newExpense.category,
      description: newExpense.description,
      amount: Number.parseInt(newExpense.amount),
      vendor: newExpense.vendor || "Not specified",
      status: "Pending",
    }

    setExpenses([...expenses, expense])
    setNewExpense({ category: "", description: "", amount: "", vendor: "" })
    setDialogOpen(false)

    toast({
      title: "Success",
      description: `Expense of ₹${Number.parseInt(newExpense.amount).toLocaleString()} added successfully`,
    })
  }

  const getCategoryTotals = () => {
    const totals = {}
    expenses.forEach((expense) => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0
      }
      totals[expense.category] += expense.amount
    })
    return totals
  }

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }

  const categoryTotals = getCategoryTotals()
  const categoryColors = {
    "Raw Materials": "from-green-500 to-emerald-500",
    Salary: "from-blue-500 to-cyan-500",
    Marketing: "from-purple-500 to-pink-500",
    Courier: "from-orange-500 to-red-500",
    Utilities: "from-yellow-500 to-orange-500",
    Maintenance: "from-indigo-500 to-purple-500",
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/95 via-pink-50/95 to-rose-50/95"></div>
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
      </div>

      <header className="relative z-10 flex h-20 shrink-0 items-center gap-2 border-b border-white/30 bg-white/90 backdrop-blur-sm px-6 shadow-sm">
        <SidebarTrigger className="-ml-1 hover:bg-red-100 transition-colors duration-200" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                Expense Tracker
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
              </h1>
              <p className="text-sm text-slate-700 font-semibold">Monitor company expenses and cost analysis</p>
            </div>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>Record a new company expense</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Courier">Courier</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="Enter expense description"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input
                    id="vendor"
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                    placeholder="Enter vendor name"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <main className="relative z-10 flex-1 space-y-8 p-6">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4 stagger-animation">
          <Card className="bg-gradient-to-br from-red-50 to-pink-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">₹{getTotalExpenses().toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">{Object.keys(categoryTotals).length}</div>
              <p className="text-xs text-muted-foreground">Expense categories</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Avg. Daily</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">
                ₹{Math.round(getTotalExpenses() / 30).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Daily average</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Pending</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {expenses.filter((e) => e.status === "Pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Pending payments</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Category Breakdown */}
          <Card className="card-hover glass-effect border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Expense Breakdown
                </span>
              </CardTitle>
              <CardDescription className="text-slate-700 font-semibold">
                Category-wise expense distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(categoryTotals).map(([category, amount], index) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-4 border border-purple-200 rounded-xl bg-white/50 card-hover overflow-hidden relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${categoryColors[category] || "from-gray-500 to-gray-600"} opacity-5`}
                  ></div>
                  <div className="relative z-10">
                    <p className="font-bold text-dark">{category}</p>
                    <p className="text-sm text-dark-secondary">
                      {((amount / getTotalExpenses()) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <div className="text-right relative z-10">
                    <p className="font-bold text-lg">₹{amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Expenses */}
          <Card className="card-hover glass-effect border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Recent Expenses
                </span>
              </CardTitle>
              <CardDescription className="text-slate-700 font-semibold">Latest expense entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenses.slice(0, 4).map((expense, index) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-white/50 card-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div>
                    <p className="font-semibold text-slate-800">{expense.description}</p>
                    <p className="text-sm text-dark-secondary font-medium">
                      {expense.category} • {expense.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{expense.amount.toLocaleString()}</p>
                    <Badge variant={expense.status === "Paid" ? "secondary" : "destructive"}>{expense.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card className="card-hover glass-effect border-0 bg-white/70 backdrop-blur-sm animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Expense Log
              </span>
            </CardTitle>
            <CardDescription className="text-slate-700 font-semibold">
              Complete expense history and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-900 font-bold">Date</TableHead>
                  <TableHead className="text-slate-900 font-bold">Category</TableHead>
                  <TableHead className="text-slate-900 font-bold">Description</TableHead>
                  <TableHead className="text-slate-900 font-bold">Vendor</TableHead>
                  <TableHead className="text-slate-900 font-bold">Amount</TableHead>
                  <TableHead className="text-slate-900 font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="text-slate-800 font-medium">{expense.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-purple-200 text-purple-700">
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">{expense.description}</TableCell>
                    <TableCell className="text-slate-800 font-medium">{expense.vendor}</TableCell>
                    <TableCell className="font-bold text-slate-900">₹{expense.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={expense.status === "Paid" ? "secondary" : "destructive"}>{expense.status}</Badge>
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
