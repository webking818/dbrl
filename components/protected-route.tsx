"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"]
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!loading && !user && !isPublicRoute && isClient) {
      router.push("/login")
    }
  }, [user, loading, router, isPublicRoute, isClient])

  // Show loading spinner while checking authentication
  if (loading || !isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated and trying to access protected route, don't render anything
  // (useEffect will redirect to login)
  if (!user && !isPublicRoute) {
    return null
  }

  // If user is authenticated and trying to access public route, redirect to dashboard
  if (user && isPublicRoute) {
    router.push("/")
    return null
  }

  return <>{children}</>
}
