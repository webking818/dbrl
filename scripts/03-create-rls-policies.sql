-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finished_goods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_spend ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_center ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profit_estimator ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Raw materials policies
CREATE POLICY "Users can view own raw materials" ON public.raw_materials
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own raw materials" ON public.raw_materials
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own raw materials" ON public.raw_materials
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own raw materials" ON public.raw_materials
    FOR DELETE USING (auth.uid() = user_id);

-- Finished goods policies
CREATE POLICY "Users can view own finished goods" ON public.finished_goods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own finished goods" ON public.finished_goods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own finished goods" ON public.finished_goods
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own finished goods" ON public.finished_goods
    FOR DELETE USING (auth.uid() = user_id);

-- Dispatch log policies
CREATE POLICY "Users can view own dispatch log" ON public.dispatch_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dispatch log" ON public.dispatch_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dispatch log" ON public.dispatch_log
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dispatch log" ON public.dispatch_log
    FOR DELETE USING (auth.uid() = user_id);

-- Staff policies
CREATE POLICY "Users can view own staff" ON public.staff
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own staff" ON public.staff
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own staff" ON public.staff
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own staff" ON public.staff
    FOR DELETE USING (auth.uid() = user_id);

-- Attendance policies
CREATE POLICY "Users can view own attendance" ON public.attendance
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attendance" ON public.attendance
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attendance" ON public.attendance
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own attendance" ON public.attendance
    FOR DELETE USING (auth.uid() = user_id);

-- Payroll policies
CREATE POLICY "Users can view own payroll" ON public.payroll
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payroll" ON public.payroll
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payroll" ON public.payroll
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payroll" ON public.payroll
    FOR DELETE USING (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Users can view own products" ON public.products
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products" ON public.products
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON public.products
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products" ON public.products
    FOR DELETE USING (auth.uid() = user_id);

-- Expenses policies
CREATE POLICY "Users can view own expenses" ON public.expenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" ON public.expenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" ON public.expenses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON public.expenses
    FOR DELETE USING (auth.uid() = user_id);

-- Ad spend policies
CREATE POLICY "Users can view own ad spend" ON public.ad_spend
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ad spend" ON public.ad_spend
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ad spend" ON public.ad_spend
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ad spend" ON public.ad_spend
    FOR DELETE USING (auth.uid() = user_id);

-- Call center policies
CREATE POLICY "Users can view own call center" ON public.call_center
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call center" ON public.call_center
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call center" ON public.call_center
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own call center" ON public.call_center
    FOR DELETE USING (auth.uid() = user_id);

-- Profit estimator policies
CREATE POLICY "Users can view own profit estimator" ON public.profit_estimator
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profit estimator" ON public.profit_estimator
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profit estimator" ON public.profit_estimator
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profit estimator" ON public.profit_estimator
    FOR DELETE USING (auth.uid() = user_id);

-- Performance reports policies
CREATE POLICY "Users can view own performance reports" ON public.performance_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own performance reports" ON public.performance_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own performance reports" ON public.performance_reports
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own performance reports" ON public.performance_reports
    FOR DELETE USING (auth.uid() = user_id);
