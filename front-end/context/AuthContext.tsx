'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react'

const SESSION_DURATION_MS = 30 * 60 * 1000
const SESSION_COOKIE_MAX_AGE = 30 * 60
const SESSION_EXPIRES_AT_KEY = 'tampets_admin_auth_expiresAt'

interface AuthContextType {
  isLogged: boolean
  login: (role?: string) => void
  logout: (options?: { redirect?: boolean }) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function clearSessionStorage() {
  localStorage.removeItem('isLogged')
  localStorage.removeItem('role')
  localStorage.removeItem('admin')
  localStorage.removeItem(SESSION_EXPIRES_AT_KEY)
}

function clearSessionCookie() {
  document.cookie = 'tampets_admin_auth=; path=/; max-age=0; samesite=lax'
}

function getStoredSessionExpiry() {
  const rawExpiry = localStorage.getItem(SESSION_EXPIRES_AT_KEY)

  if (!rawExpiry) {
    return null
  }

  const expiry = Number(rawExpiry)
  return Number.isFinite(expiry) ? expiry : null
}

function hasValidStoredSession() {
  if (typeof window === 'undefined') {
    return false
  }

  const isLogged = localStorage.getItem('isLogged') === 'true' || document.cookie.includes('tampets_admin_auth=true')
  const expiry = getStoredSessionExpiry()

  return Boolean(isLogged && expiry && expiry > Date.now())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isLogged, setIsLogged] = useState(() => hasValidStoredSession())

  const login = useCallback((role = 'admin') => {
    const expiresAt = Date.now() + SESSION_DURATION_MS

    setIsLogged(true)
    localStorage.setItem('isLogged', 'true')
    localStorage.setItem('role', role)
    localStorage.setItem(SESSION_EXPIRES_AT_KEY, String(expiresAt))
    document.cookie = `tampets_admin_auth=true; path=/; max-age=${SESSION_COOKIE_MAX_AGE}; samesite=lax`
  }, [])

  const logout = useCallback((options?: { redirect?: boolean }) => {
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current)
      sessionTimerRef.current = null
    }

    setIsLogged(false)
    clearSessionStorage()
    clearSessionCookie()

    if (options?.redirect !== false) {
      router.replace('/login')
    }
  }, [router])

  useEffect(() => {
    if (!hasValidStoredSession()) {
      if (typeof window !== 'undefined') {
        clearSessionStorage()
        clearSessionCookie()
      }

      logout({ redirect: pathname.startsWith('/admin') })
      return
    }

    const sessionExpiry = getStoredSessionExpiry()

    if (!sessionExpiry) {
      logout({ redirect: pathname.startsWith('/admin') })
      return
    }

    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current)
    }

    const remainingTime = sessionExpiry - Date.now()

    sessionTimerRef.current = setTimeout(() => {
      logout()
    }, remainingTime)

    return () => {
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current)
        sessionTimerRef.current = null
      }
    }
  }, [logout, pathname])

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
