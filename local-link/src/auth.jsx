import { createContext, useContext, useEffect, useState } from 'react'

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
  const signIn = ({ name, email, accountType, businessName }) => {
    setUser({ name, email, accountType, businessName })
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
