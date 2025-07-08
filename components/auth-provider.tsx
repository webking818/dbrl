"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  getCurrentUser,
  onAuthStateChange,
  signUp as authSignUp,
  signIn as authSignIn,
  signOut as authSignOut,
  type User,
} from "@/lib/auth"
import { isSupabaseConfigured } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  isConfigured: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const configured = isSupabaseConfigured()

  useEffect(() => {
    // Get initial user
    getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true)
    try {
      const result = await authSignUp(email, password, fullName)
      if (result.data?.user) {
        setUser(result.data.user)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await authSignIn(email, password)
      if (result.data?.user) {
        const user = await getCurrentUser()
        setUser(user)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const result = await authSignOut()
      setUser(null)
      return result
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: configured,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
