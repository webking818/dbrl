"use client"

import type * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { memo, useCallback } from "react"
import {
  BarChart3,
  Building2,
  Calendar,
  DollarSign,
  Home,
  Package,
  Phone,
  PieChart,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Inventory",
      items: [
        {
          title: "Raw Materials",
          url: "/raw-materials",
          icon: Package,
        },
        {
          title: "Finished Goods",
          url: "/finished-goods",
          icon: ShoppingCart,
        },
        {
          title: "Product Master",
          url: "/products",
          icon: Package,
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          title: "Dispatch Log",
          url: "/dispatch",
          icon: Truck,
        },
        {
          title: "Staff Management",
          url: "/staff",
          icon: Users,
        },
        {
          title: "Attendance",
          url: "/attendance",
          icon: Calendar,
        },
        {
          title: "Payroll",
          url: "/payroll",
          icon: DollarSign,
        },
      ],
    },
    {
      title: "Business Intelligence",
      items: [
        {
          title: "Ad Spend Tracker",
          url: "/ad-spend",
          icon: TrendingUp,
        },
        {
          title: "Call Center",
          url: "/call-center",
          icon: Phone,
        },
        {
          title: "Profit Estimator",
          url: "/profit-estimator",
          icon: BarChart3,
        },
        {
          title: "Performance Reports",
          url: "/performance",
          icon: PieChart,
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          title: "Expenses",
          url: "/expenses",
          icon: DollarSign,
        },
      ],
    },
  ],
}

// Memoized navigation item component for better performance
const NavigationItem = memo(({ item, pathname }: { item: any; pathname: string }) => {
  const router = useRouter()

  const handleClick = useCallback(
    (e: React.MouseEvent, url: string) => {
      e.preventDefault()
      // Use router.push for faster client-side navigation
      router.push(url)
    },
    [router],
  )

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={pathname === item.url}>
        <a href={item.url} className="flex items-center gap-2" onClick={(e) => handleClick(e, item.url)}>
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
})

NavigationItem.displayName = "NavigationItem"

export const AppSidebar = memo(({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const router = useRouter()
  const pathname = usePathname()
  const { signOut, user } = useAuth()

  const handleLogout = useCallback(async () => {
    await signOut()
    router.push("/login")
  }, [signOut, router])

  const handleHomeClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      router.push("/")
    },
    [router],
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Building2 className="h-6 w-6" />
          <span className="font-bold text-lg">ERP System</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto overflow-x-hidden">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.url ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <a href={item.url} className="flex items-center gap-2" onClick={handleHomeClick}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  item.items?.map((subItem) => (
                    <NavigationItem key={subItem.title} item={subItem} pathname={pathname} />
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
})

AppSidebar.displayName = "AppSidebar"
