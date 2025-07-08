-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create raw_materials table
CREATE TABLE IF NOT EXISTS public.raw_materials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    material_name TEXT NOT NULL,
    supplier TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL CHECK (quantity >= 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    purchase_date DATE NOT NULL,
    expiry_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'used')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create finished_goods table
CREATE TABLE IF NOT EXISTS public.finished_goods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_name TEXT NOT NULL,
    sku TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
    selling_price DECIMAL(10,2) NOT NULL CHECK (selling_price >= 0),
    total_value DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    manufacturing_date DATE NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'damaged')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dispatch_log table
CREATE TABLE IF NOT EXISTS public.dispatch_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    order_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    dispatch_date DATE NOT NULL,
    expected_delivery DATE NOT NULL,
    courier_service TEXT NOT NULL,
    tracking_number TEXT,
    status TEXT DEFAULT 'dispatched' CHECK (status IN ('dispatched', 'in_transit', 'delivered', 'returned')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    employee_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    salary DECIMAL(10,2) NOT NULL CHECK (salary >= 0),
    hire_date DATE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    address TEXT,
    emergency_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, employee_id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    hours_worked DECIMAL(4,2) DEFAULT 0,
    status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(staff_id, date)
);

-- Create payroll table
CREATE TABLE IF NOT EXISTS public.payroll (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL CHECK (year >= 2020),
    basic_salary DECIMAL(10,2) NOT NULL CHECK (basic_salary >= 0),
    overtime_hours DECIMAL(5,2) DEFAULT 0 CHECK (overtime_hours >= 0),
    overtime_rate DECIMAL(10,2) DEFAULT 0 CHECK (overtime_rate >= 0),
    overtime_pay DECIMAL(10,2) GENERATED ALWAYS AS (overtime_hours * overtime_rate) STORED,
    bonus DECIMAL(10,2) DEFAULT 0 CHECK (bonus >= 0),
    deductions DECIMAL(10,2) DEFAULT 0 CHECK (deductions >= 0),
    gross_salary DECIMAL(10,2) GENERATED ALWAYS AS (basic_salary + (overtime_hours * overtime_rate) + bonus) STORED,
    net_salary DECIMAL(10,2) GENERATED ALWAYS AS (basic_salary + (overtime_hours * overtime_rate) + bonus - deductions) STORED,
    payment_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(staff_id, month, year)
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    cost_price DECIMAL(10,2) NOT NULL CHECK (cost_price >= 0),
    selling_price DECIMAL(10,2) NOT NULL CHECK (selling_price >= 0),
    margin DECIMAL(10,2) GENERATED ALWAYS AS (selling_price - cost_price) STORED,
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    reorder_level INTEGER DEFAULT 10 CHECK (reorder_level >= 0),
    supplier TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, sku)
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    expense_date DATE NOT NULL,
    payment_method TEXT NOT NULL,
    receipt_number TEXT,
    vendor TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ad_spend table
CREATE TABLE IF NOT EXISTS public.ad_spend (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('Meta', 'Google Ads', 'Amazon Ads')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    campaign TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create call_center table
CREATE TABLE IF NOT EXISTS public.call_center (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    calls_received INTEGER NOT NULL CHECK (calls_received >= 0),
    calls_answered INTEGER NOT NULL CHECK (calls_answered >= 0),
    ndr_received INTEGER DEFAULT 0 CHECK (ndr_received >= 0),
    ndr_resolved INTEGER DEFAULT 0 CHECK (ndr_resolved >= 0),
    avg_response_time DECIMAL(5,2) DEFAULT 0 CHECK (avg_response_time >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create profit_estimator table
CREATE TABLE IF NOT EXISTS public.profit_estimator (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    revenue DECIMAL(12,2) NOT NULL CHECK (revenue >= 0),
    ad_spend DECIMAL(10,2) DEFAULT 0 CHECK (ad_spend >= 0),
    shipping DECIMAL(10,2) DEFAULT 0 CHECK (shipping >= 0),
    cogs DECIMAL(10,2) DEFAULT 0 CHECK (cogs >= 0),
    other_expenses DECIMAL(10,2) DEFAULT 0 CHECK (other_expenses >= 0),
    estimated_profit DECIMAL(12,2) GENERATED ALWAYS AS (revenue - ad_spend - shipping - cogs - other_expenses) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create performance_reports table
CREATE TABLE IF NOT EXISTS public.performance_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_name TEXT NOT NULL,
    sku TEXT NOT NULL,
    month TEXT NOT NULL, -- Format: YYYY-MM
    sales DECIMAL(12,2) NOT NULL CHECK (sales >= 0),
    returns DECIMAL(10,2) DEFAULT 0 CHECK (returns >= 0),
    ad_spend DECIMAL(10,2) DEFAULT 0 CHECK (ad_spend >= 0),
    cogs DECIMAL(10,2) DEFAULT 0 CHECK (cogs >= 0),
    net_margin DECIMAL(12,2) GENERATED ALWAYS AS (sales - returns - ad_spend - cogs) STORED,
    units INTEGER NOT NULL CHECK (units >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, sku, month)
);
