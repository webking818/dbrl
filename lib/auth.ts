import { supabase, isSupabaseConfigured } from "./supabase"

export interface User {
  id: string
  email: string
  full_name?: string
  role: "admin" | "manager" | "user"
}

// Mock user for development
const mockUser: User = {
  id: "mock-user-id",
  email: "demo@example.com",
  full_name: "Demo User",
  role: "admin",
}

export const signUp = async (email: string, password: string, fullName?: string) => {
  if (!isSupabaseConfigured()) {
    return {
      data: { user: mockUser },
      error: null,
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured()) {
    return {
      data: { user: mockUser },
      error: null,
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    return { error: null }
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async (): Promise<User | null> => {
  if (!isSupabaseConfigured()) {
    return mockUser
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user profile from profiles table
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return profile
    ? {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
      }
    : null
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!isSupabaseConfigured()) {
    callback(mockUser)
    return { data: { subscription: { unsubscribe: () => {} } } }
  }

  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })
}
