import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from './supabase.js'

/*
 * Accounts are Supabase Auth users. The name and account type ("customer" or
 * "business") are saved in each user's metadata when they sign up.
 */

const AuthContext = createContext(null)

function toUser(session) {
  const authUser = session?.user
  if (!authUser) return null
  return {
    id: authUser.id,
    email: authUser.email,
    name: authUser.user_metadata.name || authUser.email,
    accountType: authUser.user_metadata.account_type ?? 'customer',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // True until the saved session has been read, so pages don't bounce to /login.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session))
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session))
    })
    return () => data.subscription.unsubscribe()
  }, [])

  // Each returns the signed-in user, or throws with a message for the form.
  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return toUser(data.session)
  }

  // Returns null when Supabase wants the email confirmed before the first login.
  const signUp = async ({ name, email, password, accountType }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, account_type: accountType } },
    })
    if (error) throw error
    return toUser(data.session)
  }

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loading />
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export function Loading() {
  return (
    <section className="section">
      <div className="shell">
        <p className="text-ink/60">Loading…</p>
      </div>
    </section>
  )
}
