import { supabase, isSupabaseConfigured } from "./supabase"
import type { Database } from "./supabase"

type TableName = keyof Database["public"]["Tables"]

export class DatabaseService {
  static async getAll<T extends TableName>(
    table: T,
    userId?: string,
  ): Promise<Database["public"]["Tables"][T]["Row"][]> {
    if (!isSupabaseConfigured()) {
      console.log(`Using demo mode for ${table}`)
      return []
    }

    try {
      const query = supabase.from(table).select("*")

      if (userId) {
        query.eq("user_id", userId)
      }

      const { data, error } = await query

      if (error) {
        console.error(`Error fetching ${table}:`, error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error(`Database error for ${table}:`, error)
      return []
    }
  }

  static async create<T extends TableName>(
    table: T,
    data: Database["public"]["Tables"][T]["Insert"],
  ): Promise<{ data: Database["public"]["Tables"][T]["Row"] | null; error: any }> {
    if (!isSupabaseConfigured()) {
      console.log(`Demo mode: simulating create for ${table}`)
      return { data: null, error: { message: "Demo mode - data not saved" } }
    }

    try {
      const { data: result, error } = await supabase.from(table).insert(data).select().single()

      if (error) {
        console.error(`Error creating ${table}:`, error)
      }

      return { data: result, error }
    } catch (error) {
      console.error(`Database error creating ${table}:`, error)
      return { data: null, error }
    }
  }

  static async update<T extends TableName>(
    table: T,
    id: string,
    data: Database["public"]["Tables"][T]["Update"],
  ): Promise<{ data: Database["public"]["Tables"][T]["Row"] | null; error: any }> {
    if (!isSupabaseConfigured()) {
      console.log(`Demo mode: simulating update for ${table}`)
      return { data: null, error: { message: "Demo mode - data not saved" } }
    }

    try {
      const { data: result, error } = await supabase.from(table).update(data).eq("id", id).select().single()

      if (error) {
        console.error(`Error updating ${table}:`, error)
      }

      return { data: result, error }
    } catch (error) {
      console.error(`Database error updating ${table}:`, error)
      return { data: null, error }
    }
  }

  static async delete<T extends TableName>(table: T, id: string): Promise<{ error: any }> {
    if (!isSupabaseConfigured()) {
      console.log(`Demo mode: simulating delete for ${table}`)
      return { error: { message: "Demo mode - data not deleted" } }
    }

    try {
      const { error } = await supabase.from(table).delete().eq("id", id)

      if (error) {
        console.error(`Error deleting ${table}:`, error)
      }

      return { error }
    } catch (error) {
      console.error(`Database error deleting ${table}:`, error)
      return { error }
    }
  }

  static async getDashboardAnalytics(userId: string) {
    if (!isSupabaseConfigured()) {
      return {
        totalRevenue: 125000,
        totalExpenses: 45000,
        totalProfit: 80000,
        totalOrders: 1250,
        recentActivity: [
          { type: "order", description: "New order #1234", time: "2 hours ago" },
          { type: "expense", description: "Office supplies purchased", time: "4 hours ago" },
          { type: "staff", description: "New employee added", time: "1 day ago" },
        ],
      }
    }

    try {
      // Get real analytics from database
      const [profitData, expensesData, ordersData] = await Promise.all([
        supabase.from("profit_estimator").select("*").eq("user_id", userId),
        supabase.from("expenses").select("*").eq("user_id", userId),
        supabase.from("dispatch_log").select("*").eq("user_id", userId),
      ])

      const totalRevenue = profitData.data?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0
      const totalExpenses = expensesData.data?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0
      const totalProfit = totalRevenue - totalExpenses
      const totalOrders = ordersData.data?.length || 0

      return {
        totalRevenue,
        totalExpenses,
        totalProfit,
        totalOrders,
        recentActivity: [{ type: "order", description: "Data loaded from database", time: "now" }],
      }
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error)
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        totalProfit: 0,
        totalOrders: 0,
        recentActivity: [],
      }
    }
  }
}

// Specific service functions for each module
export const CallCenterService = {
  getAll: (userId: string) => DatabaseService.getAll("call_center", userId),
  create: (data: Database["public"]["Tables"]["call_center"]["Insert"]) => DatabaseService.create("call_center", data),
  update: (id: string, data: Database["public"]["Tables"]["call_center"]["Update"]) =>
    DatabaseService.update("call_center", id, data),
  delete: (id: string) => DatabaseService.delete("call_center", id),
}

export const ProfitEstimatorService = {
  getAll: (userId: string) => DatabaseService.getAll("profit_estimator", userId),
  create: (data: Database["public"]["Tables"]["profit_estimator"]["Insert"]) =>
    DatabaseService.create("profit_estimator", data),
  update: (id: string, data: Database["public"]["Tables"]["profit_estimator"]["Update"]) =>
    DatabaseService.update("profit_estimator", id, data),
  delete: (id: string) => DatabaseService.delete("profit_estimator", id),
}

export const PerformanceReportsService = {
  getAll: (userId: string) => DatabaseService.getAll("performance_reports", userId),
  create: (data: Database["public"]["Tables"]["performance_reports"]["Insert"]) =>
    DatabaseService.create("performance_reports", data),
  update: (id: string, data: Database["public"]["Tables"]["performance_reports"]["Update"]) =>
    DatabaseService.update("performance_reports", id, data),
  delete: (id: string) => DatabaseService.delete("performance_reports", id),
}

// Keep existing services
export const AdSpendService = {
  getAll: (userId: string) => DatabaseService.getAll("ad_spend", userId),
  create: (data: Database["public"]["Tables"]["ad_spend"]["Insert"]) => DatabaseService.create("ad_spend", data),
  update: (id: string, data: Database["public"]["Tables"]["ad_spend"]["Update"]) =>
    DatabaseService.update("ad_spend", id, data),
  delete: (id: string) => DatabaseService.delete("ad_spend", id),
}

export const RawMaterialsService = {
  getAll: (userId: string) => DatabaseService.getAll("raw_materials", userId),
  create: (data: Database["public"]["Tables"]["raw_materials"]["Insert"]) =>
    DatabaseService.create("raw_materials", data),
  update: (id: string, data: Database["public"]["Tables"]["raw_materials"]["Update"]) =>
    DatabaseService.update("raw_materials", id, data),
  delete: (id: string) => DatabaseService.delete("raw_materials", id),
}

export const AttendanceService = {
  getAll: (userId: string) => DatabaseService.getAll("attendance", userId),
  create: (data: Database["public"]["Tables"]["attendance"]["Insert"]) => DatabaseService.create("attendance", data),
  update: (id: string, data: Database["public"]["Tables"]["attendance"]["Update"]) =>
    DatabaseService.update("attendance", id, data),
  delete: (id: string) => DatabaseService.delete("attendance", id),
}

export const StaffService = {
  getAll: (userId: string) => DatabaseService.getAll("staff", userId),
  create: (data: Database["public"]["Tables"]["staff"]["Insert"]) => DatabaseService.create("staff", data),
  update: (id: string, data: Database["public"]["Tables"]["staff"]["Update"]) =>
    DatabaseService.update("staff", id, data),
  delete: (id: string) => DatabaseService.delete("staff", id),
}

// Add other services as needed
export const FinishedGoodsService = {
  getAll: (userId: string) => DatabaseService.getAll("finished_goods", userId),
  create: (data: Database["public"]["Tables"]["finished_goods"]["Insert"]) =>
    DatabaseService.create("finished_goods", data),
  update: (id: string, data: Database["public"]["Tables"]["finished_goods"]["Update"]) =>
    DatabaseService.update("finished_goods", id, data),
  delete: (id: string) => DatabaseService.delete("finished_goods", id),
}

export const DispatchLogService = {
  getAll: (userId: string) => DatabaseService.getAll("dispatch_log", userId),
  create: (data: Database["public"]["Tables"]["dispatch_log"]["Insert"]) =>
    DatabaseService.create("dispatch_log", data),
  update: (id: string, data: Database["public"]["Tables"]["dispatch_log"]["Update"]) =>
    DatabaseService.update("dispatch_log", id, data),
  delete: (id: string) => DatabaseService.delete("dispatch_log", id),
}

export const PayrollService = {
  getAll: (userId: string) => DatabaseService.getAll("payroll", userId),
  create: (data: Database["public"]["Tables"]["payroll"]["Insert"]) => DatabaseService.create("payroll", data),
  update: (id: string, data: Database["public"]["Tables"]["payroll"]["Update"]) =>
    DatabaseService.update("payroll", id, data),
  delete: (id: string) => DatabaseService.delete("payroll", id),
}

export const ProductsService = {
  getAll: (userId: string) => DatabaseService.getAll("products", userId),
  create: (data: Database["public"]["Tables"]["products"]["Insert"]) => DatabaseService.create("products", data),
  update: (id: string, data: Database["public"]["Tables"]["products"]["Update"]) =>
    DatabaseService.update("products", id, data),
  delete: (id: string) => DatabaseService.delete("products", id),
}

export const ExpensesService = {
  getAll: (userId: string) => DatabaseService.getAll("expenses", userId),
  create: (data: Database["public"]["Tables"]["expenses"]["Insert"]) => DatabaseService.create("expenses", data),
  update: (id: string, data: Database["public"]["Tables"]["expenses"]["Update"]) =>
    DatabaseService.update("expenses", id, data),
  delete: (id: string) => DatabaseService.delete("expenses", id),
}
