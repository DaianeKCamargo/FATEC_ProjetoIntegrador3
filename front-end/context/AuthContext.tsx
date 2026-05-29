'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isLogged: boolean
  login: (role?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogged, setIsLogged] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return localStorage.getItem('isLogged') === 'true' || document.cookie.includes('tampets_admin_auth=true')
  })

  const login = (role = 'admin') => {
    setIsLogged(true)
    localStorage.setItem('isLogged', 'true')
    localStorage.setItem('role', role)
    document.cookie = 'tampets_admin_auth=true; path=/; max-age=86400; samesite=lax'
  }

  const logout = () => {
    setIsLogged(false)
    localStorage.removeItem('isLogged')
    localStorage.removeItem('role')
    localStorage.removeItem('admin')
    document.cookie = 'tampets_admin_auth=; path=/; max-age=0; samesite=lax'
  }

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
