import { createContext, useState, useCallback } from 'react'
import { mockUsers } from '../data/mockData'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]     = useState(null)

  /**
   * Simulate a login API call.
   * In production, replace with a real fetch/axios call.
   */
  const login = useCallback(async ({ email, password, role }) => {
    setIsLoading(true)
    setError(null)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockUser = mockUsers[role]

    // Basic mock validation
    if (!email || !password) {
      setError('Email and password are required.')
      setIsLoading(false)
      throw new Error('Email and password are required.')
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setIsLoading(false)
      throw new Error('Password must be at least 6 characters.')
    }

    // Accept any email + password ≥6 chars for mock purposes
    setUser({ ...mockUser, email })
    setIsLoading(false)
    return { ...mockUser, email }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
  }, [])

  const value = { user, isLoading, error, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
