# DBRL ERP System

A comprehensive Enterprise Resource Planning (ERP) system built with Next.js, React, and TypeScript. This system manages various business operations including inventory, staff, payroll, expenses, and business intelligence analytics.

## 🏗️ Architecture Overview

### Frontend Architecture
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom gradients and animations
- **UI Components**: shadcn/ui component library
- **State Management**: React hooks (useState, useEffect) with local storage persistence
- **Authentication**: Custom auth provider with Supabase integration
- **Data Flow**: Shared data service for cross-module communication

### Backend Architecture
- **Database**: Supabase (PostgreSQL) with fallback to localStorage for demo mode
- **Authentication**: Supabase Auth with custom auth provider wrapper
- **Data Services**: Modular service layer with TypeScript interfaces
- **Storage**: Dual-mode storage (Supabase + localStorage) for development flexibility

## 📁 Project Structure

\`\`\`
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with sidebar provider
│   ├── page.tsx                 # Dashboard homepage
│   ├── login/                   # Authentication pages
│   ├── raw-materials/           # Inventory management
│   ├── finished-goods/          # Product inventory
│   ├── staff/                   # Employee directory
│   ├── attendance/              # Time tracking
│   ├── payroll/                 # Salary management
│   ├── dispatch/                # Order fulfillment
│   ├── expenses/                # Expense tracking
│   ├── products/                # Product master
│   ├── ad-spend/                # Marketing analytics
│   ├── call-center/             # Customer support
│   ├── profit-estimator/        # Financial planning
│   └── performance/             # Business reports
├── components/                   # Reusable React components
│   ├── ui/                      # shadcn/ui components
│   ├── auth-provider.tsx        # Authentication context
│   ├── app-sidebar.tsx          # Navigation sidebar
│   ├── login-form.tsx           # Login interface
│   └── protected-route.tsx      # Route protection
├── lib/                         # Utility libraries
│   ├── supabase.ts             # Database client
│   ├── auth.ts                 # Authentication utilities
│   ├── database.ts             # Database service layer
│   ├── storage.ts              # Local storage utilities
│   ├── shared-data.ts          # Cross-module data service
│   └── utils.ts                # General utilities
├── scripts/                     # Database scripts
│   ├── 01-create-tables.sql    # Table definitions
│   ├── 02-create-indexes.sql   # Performance indexes
│   ├── 03-create-rls-policies.sql # Row Level Security
│   └── 04-create-functions.sql # Database functions
└── styles/                      # Global styles
    └── globals.css             # Tailwind and custom CSS
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (optional for demo mode)

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd dbrl-erp
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Environment Setup**

Create a `.env.local` file:
\`\`\`env
# Supabase Configuration (Optional - system works in demo mode without these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database URLs (if using Supabase)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
POSTGRES_HOST=your_postgres_host
\`\`\`

4. **Database Setup (Optional)**

If using Supabase, run the SQL scripts in order:
\`\`\`bash
# Execute in Supabase SQL Editor
scripts/01-create-tables.sql
scripts/02-create-indexes.sql
scripts/03-create-rls-policies.sql
scripts/04-create-functions.sql
\`\`\`

5. **Start Development Server**
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to access the application.

## 🔐 Authentication System

### Demo Mode
- **Default**: System runs in demo mode without Supabase
- **Credentials**: Any email/password combination works
- **Data**: Stored in localStorage, resets on browser clear

### Production Mode
- **Supabase Auth**: Full authentication with user management
- **Row Level Security**: Data isolation per user
- **Persistent Storage**: PostgreSQL database

### Auth Flow
\`\`\`typescript
// Authentication Provider Pattern
const { user, signIn, signOut, loading } = useAuth()

// Protected Route Wrapper
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
\`\`\`

## 📊 Module Architecture

### Core Modules

#### 1. **Dashboard** (`app/page.tsx`)
- **Purpose**: Central overview of all business metrics
- **Features**: 
  - Real-time KPI cards
  - Business Intelligence section
  - Recent activities feed
  - Quick action buttons
- **Data Sources**: Aggregates from all modules via SharedDataService

#### 2. **Inventory Management**
- **Raw Materials** (`app/raw-materials/page.tsx`)
  - Stock tracking with reorder alerts
  - Supplier management
  - Batch number tracking
  - Low stock notifications
  
- **Finished Goods** (`app/finished-goods/page.tsx`)
  - Product inventory
  - SKU management
  - Manufacturing date tracking
  - Sales status monitoring

#### 3. **Human Resources**
- **Staff Directory** (`app/staff/page.tsx`)
  - Employee information management
  - Department organization
  - Performance tracking
  - Contact details
  
- **Attendance** (`app/attendance/page.tsx`)
  - Daily attendance marking
  - Time tracking
  - Absence management
  - Attendance reports
  
- **Payroll** (`app/payroll/page.tsx`)
  - Salary calculations
  - Overtime management
  - Deductions handling
  - Export functionality (CSV)

#### 4. **Operations**
- **Dispatch Log** (`app/dispatch/page.tsx`)
  - Order fulfillment tracking
  - Shipping management
  - Customer information
  - Delivery status updates

#### 5. **Business Intelligence**
- **Ad Spend Tracker** (`app/ad-spend/page.tsx`)
  - Marketing spend across platforms (Meta, Google, Amazon)
  - Campaign performance tracking
  - ROI calculations
  - Platform comparison analytics
  
- **Call Center** (`app/call-center/page.tsx`)
  - Customer support metrics
  - Call volume tracking
  - Response time monitoring
  - NDR (Non-Delivery Report) management
  
- **Profit Estimator** (`app/profit-estimator/page.tsx`)
  - Daily profit calculations
  - Revenue vs expense analysis
  - Margin tracking
  - Financial forecasting
  
- **Performance Reports** (`app/performance/page.tsx`)
  - Product performance analysis
  - Sales vs returns tracking
  - Profitability by SKU
  - Monthly trend analysis

#### 6. **Financial Management**
- **Expenses** (`app/expenses/page.tsx`)
  - Expense categorization
  - Vendor management
  - Receipt tracking
  - Approval workflows

## 🔄 Data Flow Architecture

### Shared Data Service (`lib/shared-data.ts`)

The system uses a centralized data service to ensure consistency across modules:

\`\`\`typescript
// Cross-module data sharing
interface SharedExpense {
  id: string
  date: string
  category: string
  amount: number
  description: string
  source: "ad_spend" | "expenses" | "raw_materials" | "payroll"
  metadata?: any
}

// Usage example
sharedDataService.addExpense({
  date: "2024-01-15",
  amount: 1500,
  category: "Marketing",
  description: "Meta ad campaign",
  source: "ad_spend"
})
\`\`\`

### Data Interconnection

1. **Ad Spend** → Automatically creates expense entries
2. **Payroll** → Generates salary expense records
3. **Raw Materials** → Creates purchase expense entries
4. **Dispatch** → Generates revenue records
5. **Dashboard** → Aggregates all data for overview

### Storage Strategy

#### Development Mode (localStorage)
\`\`\`typescript
// Automatic fallback when Supabase not configured
const data = localStorage.getItem('module_data')
const parsedData = JSON.parse(data || '[]')
\`\`\`

#### Production Mode (Supabase)
\`\`\`typescript
// Database operations with error handling
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', userId)
\`\`\`

## 🎨 UI/UX Design System

### Design Principles
- **Gradient-based**: Consistent gradient themes per module
- **Card-based Layout**: Information organized in cards
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and semantic HTML
- **Performance**: Optimized animations and transitions

### Color Scheme
\`\`\`css
/* Module-specific gradients */
.dashboard { @apply bg-gradient-to-br from-violet-50 to-purple-50; }
.inventory { @apply bg-gradient-to-br from-emerald-50 to-teal-50; }
.hr { @apply bg-gradient-to-br from-blue-50 to-cyan-50; }
.finance { @apply bg-gradient-to-br from-yellow-50 to-orange-50; }
.bi { @apply bg-gradient-to-br from-purple-50 to-pink-50; }
\`\`\`

### Component Patterns
\`\`\`typescript
// Consistent card structure
<Card className="card-hover border-0 bg-white/90 backdrop-blur-sm">
  <CardHeader>
    <CardTitle className="flex items-center gap-3">
      <Icon className="h-5 w-5" />
      <span>Title</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
\`\`\`

## 🛠️ Development Guidelines

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js and React
- **Prettier**: Code formatting
- **Naming**: kebab-case for files, camelCase for variables

### Component Structure
\`\`\`typescript
// Standard component template
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ComponentProps } from "@/components/ui/component"

interface Props {
  // Define props
}

export default function ComponentName({ ...props }: Props) {
  // State management
  const [state, setState] = useState()
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [])
  
  // Event handlers
  const handleEvent = () => {
    // Handle events
  }
  
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
\`\`\`

### State Management Patterns
\`\`\`typescript
// Form state pattern
const [formData, setFormData] = useState({
  field1: "",
  field2: "",
})

// Update pattern
const updateField = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}

// Dialog state pattern
const [isDialogOpen, setIsDialogOpen] = useState(false)
const [editingItem, setEditingItem] = useState(null)
\`\`\`

### Error Handling
\`\`\`typescript
// Consistent error handling
try {
  const result = await operation()
  toast({
    title: "Success",
    description: "Operation completed successfully"
  })
} catch (error) {
  console.error("Operation failed:", error)
  toast({
    title: "Error", 
    description: "Operation failed",
    variant: "destructive"
  })
}
\`\`\`

## 📈 Performance Optimizations

### Frontend Optimizations
- **Memoization**: React.memo for expensive components
- **Lazy Loading**: Dynamic imports for large components
- **Image Optimization**: Next.js Image component
- **Bundle Splitting**: Automatic code splitting

### Database Optimizations
- **Indexes**: Strategic indexing on frequently queried columns
- **RLS Policies**: Row-level security for data isolation
- **Connection Pooling**: Supabase connection management
- **Caching**: localStorage for frequently accessed data

## 🚀 Deployment

### Vercel Deployment (Recommended)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
\`\`\`

### Environment Variables for Production
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
\`\`\`

### Database Migration
1. Create Supabase project
2. Run SQL scripts in order
3. Configure RLS policies
4. Test with sample data

## 🧪 Testing

### Manual Testing Checklist
- [ ] Authentication flow (login/logout)
- [ ] CRUD operations in each module
- [ ] Data persistence across sessions
- [ ] Export functionality
- [ ] Cross-module data sharing
- [ ] Responsive design on mobile
- [ ] Error handling scenarios

### Test Data
The system includes sample data for all modules to demonstrate functionality:
- Sample employees with different departments
- Raw materials with varying stock levels
- Ad spend data across platforms
- Call center metrics
- Financial data for profit calculations

## 🔧 Troubleshooting

### Common Issues

#### 1. Supabase Connection Issues
\`\`\`typescript
// Check configuration
console.log('Supabase configured:', isSupabaseConfigured())

// Verify environment variables
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
\`\`\`

#### 2. Data Not Persisting
- Check localStorage in browser dev tools
- Verify Supabase table permissions
- Check RLS policies

#### 3. Build Errors
\`\`\`bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
\`\`\`

#### 4. TypeScript Errors
- Ensure all interfaces are properly defined
- Check import paths
- Verify component prop types

## 📚 API Reference

### Database Service Methods
\`\`\`typescript
// Generic CRUD operations
DatabaseService.getAll(table, userId)
DatabaseService.create(table, data)
DatabaseService.update(table, id, data)
DatabaseService.delete(table, id)

// Specific service methods
AdSpendService.getAll(userId)
StaffService.create(staffData)
PayrollService.update(id, payrollData)
\`\`\`

### Shared Data Service
\`\`\`typescript
// Cross-module data sharing
sharedDataService.addExpense(expenseData)
sharedDataService.addRevenue(revenueData)
sharedDataService.getExpensesForDate(date)
sharedDataService.getDashboardSummary()
\`\`\`

### Authentication Methods
\`\`\`typescript
// Auth operations
const { user, signIn, signOut } = useAuth()
await signIn(email, password)
await signOut()
const currentUser = await getCurrentUser()
\`\`\`

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Review Guidelines
- Ensure TypeScript compliance
- Test all CRUD operations
- Verify responsive design
- Check accessibility standards
- Validate error handling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the code comments for implementation details

## 🔮 Future Enhancements

### Planned Features
- [ ] Real-time notifications
- [ ] Advanced reporting dashboard
- [ ] Mobile app (React Native)
- [ ] API endpoints for third-party integrations
- [ ] Advanced user roles and permissions
- [ ] Automated backup system
- [ ] Multi-language support
- [ ] Dark mode theme

### Technical Improvements
- [ ] Unit test coverage
- [ ] E2E testing with Playwright
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics integration
- [ ] PWA capabilities

---

**Built using Next.js, TypeScript, and Supabase**
