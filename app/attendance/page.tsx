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
import { Plus, Clock, Users, Calendar, CheckCircle, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Attendance() {
  const { toast } = useToast()
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      date: "2024-01-16",
      punchIn: "09:00",
      punchOut: "18:00",
      hoursWorked: 9,
      status: "Present",
      department: "Production",
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      date: "2024-01-16",
      punchIn: "09:15",
      punchOut: "17:45",
      hoursWorked: 8.5,
      status: "Present",
      department: "Quality Control",
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Mike Johnson",
      date: "2024-01-16",
      punchIn: "-",
      punchOut: "-",
      hoursWorked: 0,
      status: "Absent",
      department: "Packaging",
    },
    {
      id: 4,
      employeeId: "EMP004",
      employeeName: "Sarah Wilson",
      date: "2024-01-16",
      punchIn: "09:30",
      punchOut: "13:30",
      hoursWorked: 4,
      status: "Half Day",
      department: "Administration",
    },
  ])

  const [newAttendance, setNewAttendance] = useState({
    employeeId: "",
    employeeName: "",
    punchIn: "",
    punchOut: "",
    department: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const resetForm = () => {
    setNewAttendance({
      employeeId: "",
      employeeName: "",
      punchIn: "",
      punchOut: "",
      department: "",
    })
  }

  const handleMarkAttendance = (e) => {
    e.preventDefault()

    if (!newAttendance.employeeId || !newAttendance.employeeName || !newAttendance.punchIn) {
      toast({
        title: "Error",
        description: "Please fill in Employee ID, Name, and Punch In time",
        variant: "destructive",
      })
      return
    }

    let hoursWorked = 0
    if (newAttendance.punchIn && newAttendance.punchOut) {
      const punchInTime = new Date(`2024-01-01 ${newAttendance.punchIn}`)
      const punchOutTime = new Date(`2024-01-01 ${newAttendance.punchOut}`)
      hoursWorked = (punchOutTime.getTime() - punchInTime.getTime()) / (1000 * 60 * 60)
    }

    const attendance = {
      id: attendanceRecords.length + 1,
      employeeId: newAttendance.employeeId,
      employeeName: newAttendance.employeeName,
      date: new Date().toISOString().split("T")[0],
      punchIn: newAttendance.punchIn,
      punchOut: newAttendance.punchOut || "-",
      hoursWorked: Math.round(hoursWorked * 10) / 10,
      status:
        hoursWorked >= 8 ? "Present" : hoursWorked >= 4 ? "Half Day" : newAttendance.punchOut ? "Present" : "Present",
      department: newAttendance.department,
    }

    setAttendanceRecords((prev) => [...prev, attendance])
    resetForm()
    setIsDialogOpen(false)

    toast({
      title: "Success",
      description: `Attendance marked for ${newAttendance.employeeName}`,
    })
  }

  const getTodayStats = () => {
    const today = new Date().toISOString().split("T")[0]
    const todayRecords = attendanceRecords.filter((record) => record.date === today)
    const present = todayRecords.filter((record) => record.status === "Present" || record.status === "Half Day").length
    const absent = todayRecords.filter((record) => record.status === "Absent").length
    const totalHours = todayRecords.reduce((sum, record) => sum + record.hoursWorked, 0)

    return { present, absent, total: todayRecords.length, totalHours }
  }

  const stats = getTodayStats()

  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/95 via-blue-50/95 to-purple-50/95"></div>
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
      </div>

      <header className="relative z-10 flex h-20 shrink-0 items-center gap-2 border-b border-white/30 bg-white/90 backdrop-blur-sm px-6 shadow-sm">
        <SidebarTrigger className="-ml-1 hover:bg-indigo-100 transition-colors duration-200" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                Attendance Management
                <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
              </h1>
              <p className="text-sm text-slate-700 font-semibold">Track employee attendance and working hours</p>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-bold"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
              <DialogDescription>Record employee punch-in/punch-out</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleMarkAttendance} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    value={newAttendance.employeeId}
                    onChange={(e) => setNewAttendance((prev) => ({ ...prev, employeeId: e.target.value }))}
                    placeholder="Enter employee ID"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employeeName">Employee Name *</Label>
                  <Input
                    id="employeeName"
                    value={newAttendance.employeeName}
                    onChange={(e) => setNewAttendance((prev) => ({ ...prev, employeeName: e.target.value }))}
                    placeholder="Enter employee name"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newAttendance.department}
                  onValueChange={(value) => setNewAttendance((prev) => ({ ...prev, department: value }))}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="punchIn">Punch In Time *</Label>
                  <Input
                    id="punchIn"
                    type="time"
                    value={newAttendance.punchIn}
                    onChange={(e) => setNewAttendance((prev) => ({ ...prev, punchIn: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="punchOut">Punch Out Time (Optional)</Label>
                  <Input
                    id="punchOut"
                    type="time"
                    value={newAttendance.punchOut}
                    onChange={(e) => setNewAttendance((prev) => ({ ...prev, punchOut: e.target.value }))}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Mark Attendance
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <main className="relative z-10 flex-1 space-y-8 p-6">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-hover border-0 bg-gradient-to-br from-indigo-500 to-blue-600 text-white overflow-hidden relative shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-white">Present Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.present}</div>
              <p className="text-xs text-white font-semibold">Out of {stats.total} employees</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 bg-gradient-to-br from-blue-500 to-cyan-600 text-white overflow-hidden relative shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-white">Absent Today</CardTitle>
              <Users className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.absent}</div>
              <p className="text-xs text-white font-semibold">Employees absent</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 bg-gradient-to-br from-cyan-500 to-teal-600 text-white overflow-hidden relative shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-white">Attendance Rate</CardTitle>
              <Calendar className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
              </div>
              <p className="text-xs text-white font-semibold">Today's attendance</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden relative shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-white">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalHours}</div>
              <p className="text-xs text-white font-semibold">Hours worked today</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card className="card-hover border-0 bg-white/90 backdrop-blur-sm relative overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-md">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent font-bold">
                Today's Attendance
              </span>
            </CardTitle>
            <CardDescription className="text-slate-700 font-semibold">
              Employee attendance records for {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-900 font-bold">Employee ID</TableHead>
                  <TableHead className="text-slate-900 font-bold">Employee Name</TableHead>
                  <TableHead className="text-slate-900 font-bold">Department</TableHead>
                  <TableHead className="text-slate-900 font-bold">Punch In</TableHead>
                  <TableHead className="text-slate-900 font-bold">Punch Out</TableHead>
                  <TableHead className="text-slate-900 font-bold">Hours Worked</TableHead>
                  <TableHead className="text-slate-900 font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-bold text-slate-900">{record.employeeId}</TableCell>
                    <TableCell className="text-slate-800 font-medium">{record.employeeName}</TableCell>
                    <TableCell className="text-slate-800 font-medium">{record.department}</TableCell>
                    <TableCell className="text-slate-800 font-medium">{record.punchIn}</TableCell>
                    <TableCell className="text-slate-800 font-medium">{record.punchOut}</TableCell>
                    <TableCell className="text-slate-800 font-medium">{record.hoursWorked} hrs</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "Present"
                            ? "default"
                            : record.status === "Half Day"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {record.status}
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
