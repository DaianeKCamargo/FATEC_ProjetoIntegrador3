'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isLogged: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogged, setIsLogged] = useState(false)

  const login = () => setIsLogged(true)
  const logout = () => setIsLogged(false)

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
