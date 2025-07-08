"use client"

import type React from "react"

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
import { DollarSign, Users, Calculator, Download, Sparkles, Plus, Edit, FileText, Receipt } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Payroll() {
  const { toast } = useToast()
  const [payrollData, setPayrollData] = useState([
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      department: "Production",
      baseSalary: 25000,
      daysWorked: 26,
      totalDays: 30,
      overtimeHours: 8,
      overtimeRate: 200,
      deductions: 2000,
      grossSalary: 0,
      netSalary: 0,
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      department: "Quality Control",
      baseSalary: 30000,
      daysWorked: 28,
      totalDays: 30,
      overtimeHours: 4,
      overtimeRate: 250,
      deductions: 2500,
      grossSalary: 0,
      netSalary: 0,
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Mike Johnson",
      department: "Packaging",
      baseSalary: 22000,
      daysWorked: 24,
      totalDays: 30,
      overtimeHours: 0,
      overtimeRate: 180,
      deductions: 1800,
      grossSalary: 0,
      netSalary: 0,
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    baseSalary: "",
    daysWorked: "",
    totalDays: "30",
    overtimeHours: "",
    overtimeRate: "",
    deductions: "",
  })

  // Calculate payroll for each employee
  const calculatePayroll = () => {
    const updatedPayroll = payrollData.map((employee) => {
      const dailySalary = employee.baseSalary / employee.totalDays
      const earnedSalary = dailySalary * employee.daysWorked
      const overtimePay = employee.overtimeHours * employee.overtimeRate
      const grossSalary = earnedSalary + overtimePay
      const netSalary = grossSalary - employee.deductions

      return {
        ...employee,
        grossSalary: Math.round(grossSalary),
        netSalary: Math.round(netSalary),
      }
    })

    setPayrollData(updatedPayroll)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.employeeId || !formData.employeeName || !formData.department || !formData.baseSalary) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const employeeData = {
      id: editingEmployee?.id || payrollData.length + 1,
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      department: formData.department,
      baseSalary: Number.parseInt(formData.baseSalary) || 0,
      daysWorked: Number.parseInt(formData.daysWorked) || 0,
      totalDays: Number.parseInt(formData.totalDays) || 30,
      overtimeHours: Number.parseInt(formData.overtimeHours) || 0,
      overtimeRate: Number.parseInt(formData.overtimeRate) || 0,
      deductions: Number.parseInt(formData.deductions) || 0,
      grossSalary: 0,
      netSalary: 0,
    }

    if (editingEmployee) {
      setPayrollData((prev) => prev.map((emp) => (emp.id === editingEmployee.id ? employeeData : emp)))
      toast({
        title: "Success",
        description: "Employee payroll updated successfully",
      })
    } else {
      setPayrollData((prev) => [...prev, employeeData])
      toast({
        title: "Success",
        description: "Employee added to payroll successfully",
      })
    }

    resetForm()
    setIsDialogOpen(false)
    // Auto-calculate after adding/updating
    setTimeout(calculatePayroll, 100)
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      department: employee.department,
      baseSalary: employee.baseSalary.toString(),
      daysWorked: employee.daysWorked.toString(),
      totalDays: employee.totalDays.toString(),
      overtimeHours: employee.overtimeHours.toString(),
      overtimeRate: employee.overtimeRate.toString(),
      deductions: employee.deductions.toString(),
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      employeeId: "",
      employeeName: "",
      department: "",
      baseSalary: "",
      daysWorked: "",
      totalDays: "30",
      overtimeHours: "",
      overtimeRate: "",
      deductions: "",
    })
    setEditingEmployee(null)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  // Export functions
  const exportSalarySlips = () => {
    const csvContent = [
      [
        "Employee ID",
        "Employee Name",
        "Department",
        "Base Salary",
        "Days Worked",
        "Overtime Hours",
        "Gross Salary",
        "Deductions",
        "Net Salary",
      ],
      ...payrollData.map((emp) => [
        emp.employeeId,
        emp.employeeName,
        emp.department,
        emp.baseSalary.toString(),
        `${emp.daysWorked}/${emp.totalDays}`,
        emp.overtimeHours.toString(),
        emp.grossSalary.toString(),
        emp.deductions.toString(),
        emp.netSalary.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `salary-slips-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Salary slips exported successfully",
    })
  }

  const generateTaxReports = () => {
    const taxData = payrollData.map((emp) => {
      const annualSalary = emp.netSalary * 12
      const taxableIncome = Math.max(0, annualSalary - 250000) // Basic exemption
      const estimatedTax = taxableIncome * 0.1 // Simplified 10% tax

      return {
        employeeId: emp.employeeId,
        employeeName: emp.employeeName,
        annualSalary,
        taxableIncome,
        estimatedTax: Math.round(estimatedTax),
      }
    })

    const csvContent = [
      ["Employee ID", "Employee Name", "Annual Salary", "Taxable Income", "Estimated Tax"],
      ...taxData.map((emp) => [
        emp.employeeId,
        emp.employeeName,
        emp.annualSalary.toString(),
        emp.taxableIncome.toString(),
        emp.estimatedTax.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tax-reports-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Tax reports generated and exported successfully",
    })
  }

  const exportPayrollSummary = () => {
    const summaryData = [
      ["Metric", "Value"],
      ["Total Employees", payrollData.length.toString()],
      ["Total Payroll", getTotalPayroll().toString()],
      ["Average Salary", getAverageSalary().toString()],
      ["Report Generated", new Date().toLocaleDateString()],
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([summaryData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payroll-summary-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: "Payroll summary exported successfully",
    })
  }

  // Calculate totals
  const getTotalPayroll = () => {
    return payrollData.reduce((sum, employee) => sum + employee.netSalary, 0)
  }

  const getTotalEmployees = () => {
    return payrollData.length
  }

  const getAverageSalary = () => {
    const total = getTotalPayroll()
    return total > 0 ? Math.round(total / payrollData.length) : 0
  }

  // Auto-calculate on component mount
  useState(() => {
    calculatePayroll()
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/95 via-orange-50/95 to-red-50/95"></div>
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
      </div>

      <header className="relative z-10 flex h-20 shrink-0 items-center gap-2 border-b border-white/30 bg-white/90 backdrop-blur-sm px-6 shadow-sm">
        <SidebarTrigger className="-ml-1 hover:bg-yellow-100 transition-colors duration-200" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                Payroll Management
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
              </h1>
              <p className="text-sm text-slate-700 font-semibold">Calculate and manage employee salaries</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={calculatePayroll}
            variant="outline"
            className="border-yellow-300 hover:bg-yellow-50 transition-all duration-300 text-slate-700 font-semibold bg-transparent"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Recalculate
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-bold"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingEmployee ? "Edit Employee Payroll" : "Add Employee to Payroll"}</DialogTitle>
                <DialogDescription>
                  {editingEmployee
                    ? "Update employee payroll information"
                    : "Enter employee details for payroll calculation"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID *</Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                      placeholder="e.g., EMP001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Employee Name *</Label>
                    <Input
                      id="employeeName"
                      value={formData.employeeName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, employeeName: e.target.value }))}
                      placeholder="Full name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Quality Control">Quality Control</SelectItem>
                      <SelectItem value="Packaging">Packaging</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseSalary">Base Salary (₹) *</Label>
                    <Input
                      id="baseSalary"
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData((prev) => ({ ...prev, baseSalary: e.target.value }))}
                      placeholder="Monthly salary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deductions">Deductions (₹)</Label>
                    <Input
                      id="deductions"
                      type="number"
                      value={formData.deductions}
                      onChange={(e) => setFormData((prev) => ({ ...prev, deductions: e.target.value }))}
                      placeholder="Total deductions"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="daysWorked">Days Worked</Label>
                    <Input
                      id="daysWorked"
                      type="number"
                      min="0"
                      max="31"
                      value={formData.daysWorked}
                      onChange={(e) => setFormData((prev) => ({ ...prev, daysWorked: e.target.value }))}
                      placeholder="Days worked"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalDays">Total Days</Label>
                    <Input
                      id="totalDays"
                      type="number"
                      value={formData.totalDays}
                      onChange={(e) => setFormData((prev) => ({ ...prev, totalDays: e.target.value }))}
                      placeholder="Total working days"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overtimeHours">Overtime Hours</Label>
                    <Input
                      id="overtimeHours"
                      type="number"
                      min="0"
                      value={formData.overtimeHours}
                      onChange={(e) => setFormData((prev) => ({ ...prev, overtimeHours: e.target.value }))}
                      placeholder="OT hours"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtimeRate">Overtime Rate (₹/hour)</Label>
                  <Input
                    id="overtimeRate"
                    type="number"
                    value={formData.overtimeRate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, overtimeRate: e.target.value }))}
                    placeholder="Rate per hour"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingEmployee ? "Update Employee" : "Add Employee"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            onClick={exportPayrollSummary}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-bold"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Payroll
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex-1 space-y-8 p-6">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4 stagger-animation">
          <Card className="card-hover border-0 bg-gradient-to-br from-yellow-500 to-amber-600 text-white overflow-hidden relative shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-bold text-white">Total Employees</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white">{getTotalEmployees()}</div>
              <p className="text-xs text-white font-semibold">Active employees</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white overflow-hidden relative shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-bold text-white">Total Payroll</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white">₹{getTotalPayroll().toLocaleString()}</div>
              <p className="text-xs text-white font-semibold">This month's total</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 bg-gradient-to-br from-amber-500 to-yellow-600 text-white overflow-hidden relative shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-bold text-white">Average Salary</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <Calculator className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white">₹{getAverageSalary().toLocaleString()}</div>
              <p className="text-xs text-white font-semibold">Per employee</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 bg-gradient-to-br from-red-500 to-orange-600 text-white overflow-hidden relative shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-bold text-white">Processing Status</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Ready
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white">100%</div>
              <p className="text-xs text-white font-semibold">Calculations complete</p>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Table */}
        <Card className="card-hover border-0 bg-white/90 backdrop-blur-sm relative overflow-hidden shadow-lg">
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-md">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-bold">
                Monthly Payroll Calculation
              </span>
            </CardTitle>
            <CardDescription className="text-slate-700 font-semibold">
              Employee salary calculations for{" "}
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate-900 font-bold">Employee</TableHead>
                    <TableHead className="text-slate-900 font-bold">Department</TableHead>
                    <TableHead className="text-slate-900 font-bold">Base Salary</TableHead>
                    <TableHead className="text-slate-900 font-bold">Days Worked</TableHead>
                    <TableHead className="text-slate-900 font-bold">Overtime</TableHead>
                    <TableHead className="text-slate-900 font-bold">Gross Salary</TableHead>
                    <TableHead className="text-slate-900 font-bold">Deductions</TableHead>
                    <TableHead className="text-slate-900 font-bold">Net Salary</TableHead>
                    <TableHead className="text-slate-900 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <p className="font-bold text-slate-900">{employee.employeeName}</p>
                          <p className="text-sm text-slate-700 font-medium">{employee.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-800 font-medium">{employee.department}</TableCell>
                      <TableCell className="text-slate-800 font-medium">
                        ₹{employee.baseSalary.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-slate-800 font-medium">
                        {employee.daysWorked}/{employee.totalDays}
                      </TableCell>
                      <TableCell className="text-slate-800 font-medium">
                        {employee.overtimeHours}h @ ₹{employee.overtimeRate}
                      </TableCell>
                      <TableCell className="text-slate-800 font-medium">
                        ₹{employee.grossSalary.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-slate-800 font-medium">
                        ₹{employee.deductions.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-green-600 text-lg">₹{employee.netSalary.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(employee)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Summary */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="card-hover border-0 bg-white/90 backdrop-blur-sm relative overflow-hidden shadow-lg">
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-md">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">
                  Payroll Breakdown
                </span>
              </CardTitle>
              <CardDescription className="text-slate-700 font-semibold">
                Department-wise salary distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {Array.from(new Set(payrollData.map((emp) => emp.department))).map((dept) => {
                const deptEmployees = payrollData.filter((emp) => emp.department === dept)
                const deptTotal = deptEmployees.reduce((sum, emp) => sum + emp.netSalary, 0)
                return (
                  <div
                    key={dept}
                    className="flex items-center justify-between p-4 border border-orange-200 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{dept}</p>
                      <p className="text-sm text-slate-700 font-medium">{deptEmployees.length} employees</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹{deptTotal.toLocaleString()}</p>
                      <p className="text-xs text-slate-600 font-medium">
                        {((deptTotal / getTotalPayroll()) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="card-hover border-0 bg-white/90 backdrop-blur-sm relative overflow-hidden shadow-lg">
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg shadow-md">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-bold">
                  Payroll Actions
                </span>
              </CardTitle>
              <CardDescription className="text-slate-700 font-semibold">
                Quick actions for payroll processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <Button
                onClick={exportSalarySlips}
                className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-md"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Salary Slips
              </Button>
              <Button
                onClick={generateTaxReports}
                className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-md"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Generate Tax Reports
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-semibold shadow-md">
                <Users className="h-4 w-4 mr-2" />
                Send Salary Notifications
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-md">
                <DollarSign className="h-4 w-4 mr-2" />
                Process Bank Transfers
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
