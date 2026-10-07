import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

/*
 * Front-end only account handling. Accounts are kept in localStorage so the
 * site can be demoed without a server; this gets swapped for a real API later.
 */

const STORAGE_KEY = 'locallink.session'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  // accountType is either "customer" or "business".
  const signIn = ({ name, email, accountType }) => {
    setUser({ name, email, accountType })
  }

  const signOut = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

/* Wraps pages that need an account. Logged-out visitors are sent to the login
 * page, which brings them back here once they sign in. */
export function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
