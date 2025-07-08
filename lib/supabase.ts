import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client for development when Supabase is not configured
const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: { message: "Supabase not configured" } }),
    signInWithPassword: async () => ({ data: null, error: { message: "Supabase not configured" } }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: { message: "Supabase not configured" } }),
    update: () => ({ data: null, error: { message: "Supabase not configured" } }),
    delete: () => ({ data: null, error: { message: "Supabase not configured" } }),
    upsert: () => ({ data: null, error: { message: "Supabase not configured" } }),
  }),
})

// Export the client - use real Supabase if configured, otherwise use mock
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : (createMockClient() as any)

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Database types remain the same
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: "admin" | "manager" | "user"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: "admin" | "manager" | "user"
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: "admin" | "manager" | "user"
        }
      }
      raw_materials: {
        Row: {
          id: string
          user_id: string
          material_name: string
          supplier: string
          quantity: number
          unit_price: number
          total_cost: number
          purchase_date: string
          expiry_date: string | null
          status: "active" | "expired" | "used"
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          material_name: string
          supplier: string
          quantity: number
          unit_price: number
          purchase_date: string
          expiry_date?: string | null
          status?: "active" | "expired" | "used"
          notes?: string | null
        }
        Update: {
          material_name?: string
          supplier?: string
          quantity?: number
          unit_price?: number
          purchase_date?: string
          expiry_date?: string | null
          status?: "active" | "expired" | "used"
          notes?: string | null
        }
      }
      finished_goods: {
        Row: {
          id: string
          user_id: string
          product_name: string
          sku: string
          quantity: number
          unit_cost: number
          selling_price: number
          total_value: number
          manufacturing_date: string
          category: string
          status: "available" | "sold" | "damaged"
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          product_name: string
          sku: string
          quantity: number
          unit_cost: number
          selling_price: number
          manufacturing_date: string
          category: string
          status?: "available" | "sold" | "damaged"
          notes?: string | null
        }
        Update: {
          product_name?: string
          sku?: string
          quantity?: number
          unit_cost?: number
          selling_price?: number
          manufacturing_date?: string
          category?: string
          status?: "available" | "sold" | "damaged"
          notes?: string | null
        }
      }
      dispatch_log: {
        Row: {
          id: string
          user_id: string
          order_id: string
          customer_name: string
          customer_phone: string
          customer_address: string
          product_name: string
          quantity: number
          dispatch_date: string
          expected_delivery: string
          courier_service: string
          tracking_number: string | null
          status: "dispatched" | "in_transit" | "delivered" | "returned"
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          order_id: string
          customer_name: string
          customer_phone: string
          customer_address: string
          product_name: string
          quantity: number
          dispatch_date: string
          expected_delivery: string
          courier_service: string
          tracking_number?: string | null
          status?: "dispatched" | "in_transit" | "delivered" | "returned"
          notes?: string | null
        }
        Update: {
          order_id?: string
          customer_name?: string
          customer_phone?: string
          customer_address?: string
          product_name?: string
          quantity?: number
          dispatch_date?: string
          expected_delivery?: string
          courier_service?: string
          tracking_number?: string | null
          status?: "dispatched" | "in_transit" | "delivered" | "returned"
          notes?: string | null
        }
      }
      staff: {
        Row: {
          id: string
          user_id: string
          employee_id: string
          full_name: string
          email: string
          phone: string
          position: string
          department: string
          salary: number
          hire_date: string
          status: "active" | "inactive" | "terminated"
          address: string | null
          emergency_contact: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          employee_id: string
          full_name: string
          email: string
          phone: string
          position: string
          department: string
          salary: number
          hire_date: string
          status?: "active" | "inactive" | "terminated"
          address?: string | null
          emergency_contact?: string | null
        }
        Update: {
          employee_id?: string
          full_name?: string
          email?: string
          phone?: string
          position?: string
          department?: string
          salary?: number
          hire_date?: string
          status?: "active" | "inactive" | "terminated"
          address?: string | null
          emergency_contact?: string | null
        }
      }
      attendance: {
        Row: {
          id: string
          user_id: string
          staff_id: string
          date: string
          check_in_time: string | null
          check_out_time: string | null
          hours_worked: number
          status: "present" | "absent" | "late" | "half_day"
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          staff_id: string
          date: string
          check_in_time?: string | null
          check_out_time?: string | null
          status?: "present" | "absent" | "late" | "half_day"
          notes?: string | null
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          status?: "present" | "absent" | "late" | "half_day"
          notes?: string | null
        }
      }
      payroll: {
        Row: {
          id: string
          user_id: string
          staff_id: string
          month: number
          year: number
          basic_salary: number
          overtime_hours: number
          overtime_rate: number
          overtime_pay: number
          bonus: number
          deductions: number
          gross_salary: number
          net_salary: number
          payment_date: string | null
          status: "pending" | "paid" | "cancelled"
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          staff_id: string
          month: number
          year: number
          basic_salary: number
          overtime_hours?: number
          overtime_rate?: number
          bonus?: number
          deductions?: number
          payment_date?: string | null
          status?: "pending" | "paid" | "cancelled"
          notes?: string | null
        }
        Update: {
          basic_salary?: number
          overtime_hours?: number
          overtime_rate?: number
          bonus?: number
          deductions?: number
          payment_date?: string | null
          status?: "pending" | "paid" | "cancelled"
          notes?: string | null
        }
      }
      products: {
        Row: {
          id: string
          user_id: string
          name: string
          sku: string
          category: string
          description: string | null
          cost_price: number
          selling_price: number
          margin: number
          stock_quantity: number
          reorder_level: number
          supplier: string | null
          status: "active" | "inactive" | "discontinued"
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          sku: string
          category: string
          description?: string | null
          cost_price: number
          selling_price: number
          stock_quantity?: number
          reorder_level?: number
          supplier?: string | null
          status?: "active" | "inactive" | "discontinued"
        }
        Update: {
          name?: string
          sku?: string
          category?: string
          description?: string | null
          cost_price?: number
          selling_price?: number
          stock_quantity?: number
          reorder_level?: number
          supplier?: string | null
          status?: "active" | "inactive" | "discontinued"
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          category: string
          description: string
          amount: number
          expense_date: string
          payment_method: string
          receipt_number: string | null
          vendor: string | null
          status: "pending" | "approved" | "rejected" | "paid"
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          category: string
          description: string
          amount: number
          expense_date: string
          payment_method: string
          receipt_number?: string | null
          vendor?: string | null
          status?: "pending" | "approved" | "rejected" | "paid"
          notes?: string | null
        }
        Update: {
          category?: string
          description?: string
          amount?: number
          expense_date?: string
          payment_method?: string
          receipt_number?: string | null
          vendor?: string | null
          status?: "pending" | "approved" | "rejected" | "paid"
          notes?: string | null
        }
      }
      ad_spend: {
        Row: {
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
        Insert: {
          user_id: string
          date: string
          platform: "Meta" | "Google Ads" | "Amazon Ads"
          amount: number
          campaign?: string | null
          notes?: string | null
        }
        Update: {
          date?: string
          platform?: "Meta" | "Google Ads" | "Amazon Ads"
          amount?: number
          campaign?: string | null
          notes?: string | null
        }
      }
      call_center: {
        Row: {
          id: string
          user_id: string
          date: string
          calls_received: number
          calls_answered: number
          ndr_received: number
          ndr_resolved: number
          avg_response_time: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          date: string
          calls_received: number
          calls_answered: number
          ndr_received?: number
          ndr_resolved?: number
          avg_response_time?: number
          notes?: string | null
        }
        Update: {
          calls_received?: number
          calls_answered?: number
          ndr_received?: number
          ndr_resolved?: number
          avg_response_time?: number
          notes?: string | null
        }
      }
      profit_estimator: {
        Row: {
          id: string
          user_id: string
          date: string
          revenue: number
          ad_spend: number
          shipping: number
          cogs: number
          other_expenses: number
          estimated_profit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          date: string
          revenue: number
          ad_spend?: number
          shipping?: number
          cogs?: number
          other_expenses?: number
        }
        Update: {
          revenue?: number
          ad_spend?: number
          shipping?: number
          cogs?: number
          other_expenses?: number
        }
      }
      performance_reports: {
        Row: {
          id: string
          user_id: string
          product_name: string
          sku: string
          month: string
          sales: number
          returns: number
          ad_spend: number
          cogs: number
          net_margin: number
          units: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          product_name: string
          sku: string
          month: string
          sales: number
          returns?: number
          ad_spend?: number
          cogs?: number
          units: number
        }
        Update: {
          product_name?: string
          sku?: string
          month?: string
          sales?: number
          returns?: number
          ad_spend?: number
          cogs?: number
          units?: number
        }
      }
    }
  }
}
