-- Create indexes for better query performance

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Raw materials indexes
CREATE INDEX IF NOT EXISTS idx_raw_materials_user_id ON public.raw_materials(user_id);
CREATE INDEX IF NOT EXISTS idx_raw_materials_status ON public.raw_materials(status);
CREATE INDEX IF NOT EXISTS idx_raw_materials_expiry_date ON public.raw_materials(expiry_date);
CREATE INDEX IF NOT EXISTS idx_raw_materials_supplier ON public.raw_materials(supplier);

-- Finished goods indexes
CREATE INDEX IF NOT EXISTS idx_finished_goods_user_id ON public.finished_goods(user_id);
CREATE INDEX IF NOT EXISTS idx_finished_goods_sku ON public.finished_goods(sku);
CREATE INDEX IF NOT EXISTS idx_finished_goods_status ON public.finished_goods(status);
CREATE INDEX IF NOT EXISTS idx_finished_goods_category ON public.finished_goods(category);

-- Dispatch log indexes
CREATE INDEX IF NOT EXISTS idx_dispatch_log_user_id ON public.dispatch_log(user_id);
CREATE INDEX IF NOT EXISTS idx_dispatch_log_order_id ON public.dispatch_log(order_id);
CREATE INDEX IF NOT EXISTS idx_dispatch_log_status ON public.dispatch_log(status);
CREATE INDEX IF NOT EXISTS idx_dispatch_log_dispatch_date ON public.dispatch_log(dispatch_date);

-- Staff indexes
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON public.staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_employee_id ON public.staff(employee_id);
CREATE INDEX IF NOT EXISTS idx_staff_department ON public.staff(department);
CREATE INDEX IF NOT EXISTS idx_staff_status ON public.staff(status);

-- Attendance indexes
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_staff_id ON public.attendance(staff_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance(status);

-- Payroll indexes
CREATE INDEX IF NOT EXISTS idx_payroll_user_id ON public.payroll(user_id);
CREATE INDEX IF NOT EXISTS idx_payroll_staff_id ON public.payroll(staff_id);
CREATE INDEX IF NOT EXISTS idx_payroll_month_year ON public.payroll(month, year);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON public.payroll(status);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- Expenses indexes
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses(status);

-- Ad spend indexes
CREATE INDEX IF NOT EXISTS idx_ad_spend_user_id ON public.ad_spend(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_spend_date ON public.ad_spend(date);
CREATE INDEX IF NOT EXISTS idx_ad_spend_platform ON public.ad_spend(platform);

-- Call center indexes
CREATE INDEX IF NOT EXISTS idx_call_center_user_id ON public.call_center(user_id);
CREATE INDEX IF NOT EXISTS idx_call_center_date ON public.call_center(date);

-- Profit estimator indexes
CREATE INDEX IF NOT EXISTS idx_profit_estimator_user_id ON public.profit_estimator(user_id);
CREATE INDEX IF NOT EXISTS idx_profit_estimator_date ON public.profit_estimator(date);

-- Performance reports indexes
CREATE INDEX IF NOT EXISTS idx_performance_reports_user_id ON public.performance_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_reports_sku ON public.performance_reports(sku);
CREATE INDEX IF NOT EXISTS idx_performance_reports_month ON public.performance_reports(month);
