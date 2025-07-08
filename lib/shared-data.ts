// Shared data service for interconnecting modules
interface SharedExpense {
  id: string
  date: string
  category: string
  amount: number
  description: string
  source: "ad_spend" | "expenses" | "raw_materials" | "payroll"
  metadata?: any
}

interface SharedRevenue {
  id: string
  date: string
  amount: number
  source: "dispatch" | "profit_estimator" | "call_center"
  description: string
  metadata?: any
}

class SharedDataService {
  private static instance: SharedDataService
  private expenses: SharedExpense[] = []
  private revenues: SharedRevenue[] = []

  static getInstance(): SharedDataService {
    if (!SharedDataService.instance) {
      SharedDataService.instance = new SharedDataService()
    }
    return SharedDataService.instance
  }

  // Add expense from any module
  addExpense(expense: Omit<SharedExpense, "id">): string {
    const id = Date.now().toString()
    const newExpense = { ...expense, id }
    this.expenses.push(newExpense)
    this.saveToStorage()
    return id
  }

  // Add revenue from any module
  addRevenue(revenue: Omit<SharedRevenue, "id">): string {
    const id = Date.now().toString()
    const newRevenue = { ...revenue, id }
    this.revenues.push(newRevenue)
    this.saveToStorage()
    return id
  }

  // Get expenses for a specific date
  getExpensesForDate(date: string): SharedExpense[] {
    return this.expenses.filter((expense) => expense.date === date)
  }

  // Get revenues for a specific date
  getRevenuesForDate(date: string): SharedRevenue[] {
    return this.revenues.filter((revenue) => revenue.date === date)
  }

  // Get all expenses by source
  getExpensesBySource(source: SharedExpense["source"]): SharedExpense[] {
    return this.expenses.filter((expense) => expense.source === source)
  }

  // Get all revenues by source
  getRevenuesBySource(source: SharedRevenue["source"]): SharedRevenue[] {
    return this.revenues.filter((revenue) => revenue.source === source)
  }

  // Get total expenses for date range
  getTotalExpenses(startDate?: string, endDate?: string): number {
    let filteredExpenses = this.expenses

    if (startDate) {
      filteredExpenses = filteredExpenses.filter((expense) => expense.date >= startDate)
    }

    if (endDate) {
      filteredExpenses = filteredExpenses.filter((expense) => expense.date <= endDate)
    }

    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0)
  }

  // Get total revenues for date range
  getTotalRevenues(startDate?: string, endDate?: string): number {
    let filteredRevenues = this.revenues

    if (startDate) {
      filteredRevenues = filteredRevenues.filter((revenue) => revenue.date >= startDate)
    }

    if (endDate) {
      filteredRevenues = filteredRevenues.filter((revenue) => revenue.date <= endDate)
    }

    return filteredRevenues.reduce((total, revenue) => total + revenue.amount, 0)
  }

  // Get net profit for date range
  getNetProfit(startDate?: string, endDate?: string): number {
    const totalRevenues = this.getTotalRevenues(startDate, endDate)
    const totalExpenses = this.getTotalExpenses(startDate, endDate)
    return totalRevenues - totalExpenses
  }

  // Check if data exists for a specific date
  hasDataForDate(date: string): boolean {
    const hasExpenses = this.expenses.some((expense) => expense.date === date)
    const hasRevenues = this.revenues.some((revenue) => revenue.date === date)
    return hasExpenses || hasRevenues
  }

  // Get summary for dashboard
  getDashboardSummary() {
    const today = new Date().toISOString().split("T")[0]
    const thisMonth = new Date().toISOString().slice(0, 7)

    return {
      todayExpenses: this.getTotalExpenses(today, today),
      todayRevenues: this.getTotalRevenues(today, today),
      monthlyExpenses: this.getTotalExpenses(thisMonth + "-01", thisMonth + "-31"),
      monthlyRevenues: this.getTotalRevenues(thisMonth + "-01", thisMonth + "-31"),
      totalExpenses: this.getTotalExpenses(),
      totalRevenues: this.getTotalRevenues(),
      netProfit: this.getNetProfit(),
    }
  }

  // Save to localStorage
  private saveToStorage() {
    try {
      localStorage.setItem("shared_expenses", JSON.stringify(this.expenses))
      localStorage.setItem("shared_revenues", JSON.stringify(this.revenues))
    } catch (error) {
      console.error("Error saving shared data to storage:", error)
    }
  }

  // Load from localStorage
  loadFromStorage() {
    try {
      const expensesData = localStorage.getItem("shared_expenses")
      const revenuesData = localStorage.getItem("shared_revenues")

      if (expensesData) {
        this.expenses = JSON.parse(expensesData)
      }

      if (revenuesData) {
        this.revenues = JSON.parse(revenuesData)
      }
    } catch (error) {
      console.error("Error loading shared data from storage:", error)
    }
  }

  // Clear all data
  clearAllData() {
    this.expenses = []
    this.revenues = []
    localStorage.removeItem("shared_expenses")
    localStorage.removeItem("shared_revenues")
  }
}

export const sharedDataService = SharedDataService.getInstance()

// Helper functions for modules to use
export const addAdSpendExpense = (date: string, amount: number, platform: string, campaign?: string) => {
  return sharedDataService.addExpense({
    date,
    amount,
    category: "Marketing",
    description: `Ad spend on ${platform}${campaign ? ` - ${campaign}` : ""}`,
    source: "ad_spend",
    metadata: { platform, campaign },
  })
}

export const addPayrollExpense = (date: string, amount: number, employeeName: string, department: string) => {
  return sharedDataService.addExpense({
    date,
    amount,
    category: "Salary",
    description: `Salary for ${employeeName} (${department})`,
    source: "payroll",
    metadata: { employeeName, department },
  })
}

export const addRawMaterialExpense = (date: string, amount: number, materialName: string, supplier: string) => {
  return sharedDataService.addExpense({
    date,
    amount,
    category: "Raw Materials",
    description: `Purchase of ${materialName} from ${supplier}`,
    source: "raw_materials",
    metadata: { materialName, supplier },
  })
}

export const addDispatchRevenue = (date: string, amount: number, product: string, channel: string) => {
  return sharedDataService.addRevenue({
    date,
    amount,
    description: `Sale of ${product} via ${channel}`,
    source: "dispatch",
    metadata: { product, channel },
  })
}

export const addProfitEstimatorRevenue = (date: string, amount: number) => {
  return sharedDataService.addRevenue({
    date,
    amount,
    description: "Daily revenue from profit estimator",
    source: "profit_estimator",
  })
}
