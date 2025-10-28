// src/contexts/AuthContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: (User & { role: string }) | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded admin emails
const ADMIN_EMAILS = [
  'admin@example.com',
  'admin@hiringplatform.com',
  'superadmin@hiringplatform.com'
  // Tambahkan email admin lainnya di sini
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User & { role: string }) | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Function untuk menentukan role berdasarkan email
  const getUserRole = (email: string): string => {
    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
      return 'admin'
    }
    return 'applicant' // Default untuk semua user baru
  }

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const userWithRole = {
          ...session.user,
          role: getUserRole(session.user.email || '')
        }
        setUser(userWithRole)
      } else {
        setUser(null)
      }
      
      setSession(session)
      setIsLoading(false)
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userWithRole = {
            ...session.user,
            role: getUserRole(session.user.email || '')
          }
          setUser(userWithRole)
        } else {
          setUser(null)
        }
        setSession(session)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    // Default role untuk sign up adalah applicant
    const userMetadata = {
      ...userData,
      role: 'applicant' // Semua user baru otomatis applicant
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
      },
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}