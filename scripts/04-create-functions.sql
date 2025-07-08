-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.raw_materials FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.finished_goods FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.dispatch_log FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.payroll FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.ad_spend FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.call_center FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profit_estimator FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.performance_reports FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to calculate hours worked in attendance
CREATE OR REPLACE FUNCTION public.calculate_hours_worked()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.check_in_time IS NOT NULL AND NEW.check_out_time IS NOT NULL THEN
        NEW.hours_worked = EXTRACT(EPOCH FROM (NEW.check_out_time - NEW.check_in_time)) / 3600;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate hours worked
CREATE TRIGGER calculate_hours_worked 
    BEFORE INSERT OR UPDATE ON public.attendance 
    FOR EACH ROW EXECUTE FUNCTION public.calculate_hours_worked();

-- Function to get dashboard analytics
CREATE OR REPLACE FUNCTION public.get_dashboard_analytics(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_revenue', COALESCE((
            SELECT SUM(revenue) 
            FROM public.profit_estimator 
            WHERE user_id = user_uuid 
            AND date >= CURRENT_DATE - INTERVAL '30 days'
        ), 0),
        'total_expenses', COALESCE((
            SELECT SUM(amount) 
            FROM public.expenses 
            WHERE user_id = user_uuid 
            AND expense_date >= CURRENT_DATE - INTERVAL '30 days'
        ), 0),
        'total_ad_spend', COALESCE((
            SELECT SUM(amount) 
            FROM public.ad_spend 
            WHERE user_id = user_uuid 
            AND date >= CURRENT_DATE - INTERVAL '30 days'
        ), 0),
        'total_orders', COALESCE((
            SELECT COUNT(*) 
            FROM public.dispatch_log 
            WHERE user_id = user_uuid 
            AND dispatch_date >= CURRENT_DATE - INTERVAL '30 days'
        ), 0),
        'active_staff', COALESCE((
            SELECT COUNT(*) 
            FROM public.staff 
            WHERE user_id = user_uuid 
            AND status = 'active'
        ), 0),
        'low_stock_items', COALESCE((
            SELECT COUNT(*) 
            FROM public.products 
            WHERE user_id = user_uuid 
            AND stock_quantity <= reorder_level
        ), 0)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get monthly performance
CREATE OR REPLACE FUNCTION public.get_monthly_performance(user_uuid UUID, target_month TEXT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_sales', COALESCE((
            SELECT SUM(sales) 
            FROM public.performance_reports 
            WHERE user_id = user_uuid 
            AND month = target_month
        ), 0),
        'total_margin', COALESCE((
            SELECT SUM(net_margin) 
            FROM public.performance_reports 
            WHERE user_id = user_uuid 
            AND month = target_month
        ), 0),
        'total_units', COALESCE((
            SELECT SUM(units) 
            FROM public.performance_reports 
            WHERE user_id = user_uuid 
            AND month = target_month
        ), 0),
        'top_products', COALESCE((
            SELECT json_agg(
                json_build_object(
                    'product_name', product_name,
                    'sales', sales,
                    'margin', net_margin
                )
            )
            FROM (
                SELECT product_name, sales, net_margin
                FROM public.performance_reports 
                WHERE user_id = user_uuid 
                AND month = target_month
                ORDER BY net_margin DESC
                LIMIT 5
            ) top_products
        ), '[]'::json)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
