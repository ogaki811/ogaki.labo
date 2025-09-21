'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: { email: string } | null
}

interface LoginCredentials {
  email: string
  password: string
}

// Demo credentials (in production, this would be handled by a secure backend)
const DEMO_CREDENTIALS = {
  email: 'admin@ogaki.labo',
  password: 'portfolio123'
}

export function useAuth() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  })

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = useCallback(() => {
    try {
      const token = localStorage.getItem('admin_token')
      const email = localStorage.getItem('admin_email')
      
      if (token && email && token.startsWith('demo_token_')) {
        // Verify token is not expired (demo tokens expire after 24 hours)
        const tokenTimestamp = parseInt(token.replace('demo_token_', ''))
        const isExpired = Date.now() - tokenTimestamp > 24 * 60 * 60 * 1000
        
        if (isExpired) {
          logout()
          return
        }

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: { email }
        })
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        })
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      })
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check credentials (in production, this would be an API call)
      if (
        credentials.email === DEMO_CREDENTIALS.email &&
        credentials.password === DEMO_CREDENTIALS.password
      ) {
        const token = `demo_token_${Date.now()}`
        
        // Store in localStorage and cookies
        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_email', credentials.email)
        
        // Set HTTP-only cookie for middleware
        document.cookie = `admin_token=${token}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: { email: credentials.email }
        })

        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_email')
    
    // Clear cookie
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null
    })

    // Redirect to login
    router.push('/admin/login')
  }, [router])

  const requireAuth = useCallback(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      router.push('/admin/login')
    }
  }, [authState.isAuthenticated, authState.isLoading, router])

  return {
    ...authState,
    login,
    logout,
    requireAuth,
    checkAuthStatus
  }
}

// Custom hook for protecting admin routes
export function useAuthGuard() {
  const { isAuthenticated, isLoading, requireAuth } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      requireAuth()
    }
  }, [isLoading, requireAuth])

  return { isAuthenticated, isLoading }
}

// Custom hook for redirecting authenticated users
export function useAuthRedirect(redirectTo: string = '/admin') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  return { isAuthenticated, isLoading }
}