import { createContext, useState, useCallback, useEffect } from 'react'
import { api, authToken } from '../lib/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]     = useState(null)

  const login = useCallback(async ({ email, password, role }) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await api('/auth/login', { method: 'POST', body: { email, password, role } })
      authToken.set(result.token)
      setUser(result.user)
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    authToken.clear()
    setUser(null)
    setError(null)
  }, [])

  useEffect(() => {
    if (!authToken.get()) {
      setIsLoading(false)
      return
    }
    api('/auth/me').then((result) => setUser(result.user)).catch(() => authToken.clear()).finally(() => setIsLoading(false))
  }, [])

  const value = { user, isLoading, error, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
