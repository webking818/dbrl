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
import { Plus, Users, UserCheck, Calendar, Award, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StaffDirectory() {
  const { toast } = useToast()
  const [staff, setStaff] = useState([
    {
      id: 1,
      employeeId: "EMP001",
      name: "John Doe",
      role: "Production Manager",
      department: "Production",
      joinDate: "2023-01-15",
      salary: 45000,
      email: "john.doe@dbrl.com",
      phone: "+91 9876543210",
      status: "Active",
      performance: "Excellent",
    },
    {
      id: 2,
      employeeId: "EMP002",
      name: "Jane Smith",
      role: "Quality Control Specialist",
      department: "Quality Control",
      joinDate: "2023-03-20",
      salary: 35000,
      email: "jane.smith@dbrl.com",
      phone: "+91 9876543211",
      status: "Active",
      performance: "Good",
    },
    {
      id: 3,
      employeeId: "EMP003",
      name: "Mike Johnson",
      role: "Packaging Supervisor",
      department: "Packaging",
      joinDate: "2023-06-10",
      salary: 30000,
      email: "mike.johnson@dbrl.com",
      phone: "+91 9876543212",
      status: "Active",
      performance: "Good",
    },
    {
      id: 4,
      employeeId: "EMP004",
      name: "Sarah Wilson",
      role: "HR Executive",
      department: "Administration",
      joinDate: "2023-02-28",
      salary: 40000,
      email: "sarah.wilson@dbrl.com",
      phone: "+91 9876543213",
      status: "Active",
      performance: "Excellent",
    },
  ])

  const [newEmployee, setNewEmployee] = useState({
    employeeId: "",
    name: "",
    role: "",
    department: "",
    salary: "",
    email: "",
    phone: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEmployee.employeeId || !newEmployee.name || !newEmployee.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Check for duplicate employee ID
    const existingEmployee = staff.find((emp) => emp.employeeId.toLowerCase() === newEmployee.employeeId.toLowerCase())
    if (existingEmployee) {
      toast({
        title: "Error",
        description: "Employee ID already exists. Please use a different ID.",
        variant: "destructive",
      })
      return
    }

    // Validate email format if provided
    if (newEmployee.email && !/\S+@\S+\.\S+/.test(newEmployee.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    const employee = {
      id: staff.length + 1,
      employeeId: newEmployee.employeeId,
      name: newEmployee.name,
      role: newEmployee.role,
      department: newEmployee.department || "General",
      joinDate: new Date().toISOString().split("T")[0],
      salary: Number.parseInt(newEmployee.salary) || 0,
      email: newEmployee.email || `${newEmployee.employeeId.toLowerCase()}@dbrl.com`,
      phone: newEmployee.phone || "Not provided",
      status: "Active",
      performance: "Good",
    }

    setStaff([...staff, employee])
    resetForm()
    setIsDialogOpen(false)

    toast({
      title: "Success",
      description: `Employee ${newEmployee.name} added successfully`,
    })
  }

  const resetForm = () => {
    setNewEmployee({
      employeeId: "",
      name: "",
      role: "",
      department: "",
      salary: "",
      email: "",
      phone: "",
    })
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const getDepartmentStats = () => {
    const stats = {}
    staff.forEach((employee) => {
      if (!stats[employee.department]) {
        stats[employee.department] = 0
      }
      stats[employee.department] += 1
    })
    return stats
  }

  const getPerformanceStats = () => {
    const stats = {}
    staff.forEach((employee) => {
      if (!stats[employee.performance]) {
        stats[employee.performance] = 0
      }
      stats[employee.performance] += 1
    })
    return stats
  }

  const departmentStats = getDepartmentStats()
  const performanceStats = getPerformanceStats()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/95 via-green-50/95 to-emerald-50/95"></div>
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
      </div>

      <header className="relative z-10 flex h-20 shrink-0 items-center gap-2 border-b border-white/30 bg-white/90 backdrop-blur-sm px-6 shadow-sm">
        <SidebarTrigger className="-ml-1 hover:bg-teal-100 transition-colors duration-200" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent flex items-center gap-2">
                Staff Directory
                <Star className="h-5 w-5 text-yellow-500 animate-pulse" />
              </h1>
              <p className="text-sm text-slate-700 font-semibold">Manage employee information and performance</p>
            </div>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Enter employee details and information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    value={newEmployee.employeeId}
                    onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                    placeholder="Enter employee ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    placeholder="Enter job role"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newEmployee.department}
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Quality Control">Quality Control</SelectItem>
                      <SelectItem value="Packaging">Packaging</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Monthly Salary (₹)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                  placeholder="Enter monthly salary"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Employee</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <main className="relative z-10 flex-1 space-y-8 p-6">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4 stagger-animation">
          <Card className="bg-gradient-to-br from-teal-50 to-green-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">{staff.length}</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Departments</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">{Object.keys(departmentStats).length}</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Avg. Tenure</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">11</div>
              <p className="text-xs text-muted-foreground">Months average</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dark">Top Performers</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">{performanceStats.Excellent || 0}</div>
              <p className="text-xs text-muted-foreground">Excellent rating</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Department Distribution */}
          <Card className="card-hover glass-effect border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Department Distribution
                </span>
              </CardTitle>
              <CardDescription className="text-slate-700 font-semibold">Employee count by department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(departmentStats).map(([department, count], index) => (
                <div
                  key={department}
                  className="flex items-center justify-between p-4 border border-blue-200 rounded-xl bg-white/70 card-hover shadow-sm"
                >
                  <div>
                    <p className="font-bold text-slate-900">{department}</p>
                    <p className="text-sm text-slate-700 font-medium">
                      {((count / staff.length) * 100).toFixed(1)}% of workforce
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-slate-900">{count}</p>
                    <p className="text-xs text-slate-600 font-medium">employees</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="card-hover glass-effect border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Performance Overview
                </span>
              </CardTitle>
              <CardDescription className="text-slate-700 font-semibold">Employee performance ratings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(performanceStats).map(([rating, count], index) => (
                <div
                  key={rating}
                  className="flex items-center justify-between p-4 border border-yellow-200 rounded-xl bg-white/70 card-hover shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{rating}</p>
                    <p className="text-sm text-slate-600">Performance rating</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl">{count}</p>
                    <Badge
                      variant={rating === "Excellent" ? "default" : "secondary"}
                      className={rating === "Excellent" ? "bg-green-500" : ""}
                    >
                      {((count / staff.length) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Staff Table */}
        <Card className="card-hover border-0 bg-white/90 backdrop-blur-sm relative overflow-hidden shadow-lg">
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg shadow-md">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent font-bold">
                Employee Directory
              </span>
            </CardTitle>
            <CardDescription className="text-slate-700 font-semibold">
              Complete staff information and details
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-900 font-bold">Employee ID</TableHead>
                  <TableHead className="text-slate-900 font-bold">Name</TableHead>
                  <TableHead className="text-slate-900 font-bold">Role</TableHead>
                  <TableHead className="text-slate-900 font-bold">Department</TableHead>
                  <TableHead className="text-slate-900 font-bold">Join Date</TableHead>
                  <TableHead className="text-slate-900 font-bold">Salary</TableHead>
                  <TableHead className="text-slate-900 font-bold">Performance</TableHead>
                  <TableHead className="text-slate-900 font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-bold text-slate-900">{employee.employeeId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold text-slate-900">{employee.name}</p>
                        <p className="text-sm text-slate-700 font-medium">{employee.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-800 font-medium">{employee.role}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-teal-200 text-teal-700 font-medium">
                        {employee.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-800 font-medium">{employee.joinDate}</TableCell>
                    <TableCell className="font-bold text-slate-900">₹{employee.salary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={employee.performance === "Excellent" ? "default" : "secondary"}
                        className={employee.performance === "Excellent" ? "bg-green-500 text-white" : ""}
                      >
                        {employee.performance}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{employee.status}</Badge>
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
