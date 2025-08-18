"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthContextType } from "@/types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("techJobs_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, type: "employer" | "candidate"): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call - In real app, this would be an actual API request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple mock authentication
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
      type,
      createdAt: new Date(),
    }

    setUser(mockUser)
    localStorage.setItem("techJobs_user", JSON.stringify(mockUser))
    setIsLoading(false)
    return true
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    type: "employer" | "candidate",
  ): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      type,
      createdAt: new Date(),
    }

    setUser(mockUser)
    localStorage.setItem("techJobs_user", JSON.stringify(mockUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("techJobs_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
