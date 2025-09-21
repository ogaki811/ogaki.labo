'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const email = localStorage.getItem('admin_email')
      
      if (token && email && token.startsWith('demo_token_')) {
        // Check if token is expired (24 hours)
        const tokenTimestamp = parseInt(token.replace('demo_token_', ''))
        const isExpired = Date.now() - tokenTimestamp > 24 * 60 * 60 * 1000
        
        if (isExpired) {
          logout()
          return
        }

        setUser({ 
          email, 
          name: email === 'admin@ogaki.labo' ? '管理者' : '管理者'
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Demo authentication
      if (email === 'admin@ogaki.labo' && password === 'portfolio123') {
        const token = `demo_token_${Date.now()}`
        
        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_email', email)
        
        // Set HTTP-only cookie for middleware
        document.cookie = `admin_token=${token}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`

        setUser({ 
          email, 
          name: '管理者'
        })
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_email')
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    
    setUser(null)
    router.push('/admin/login')
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protecting routes
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/admin/login')
      }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }
}