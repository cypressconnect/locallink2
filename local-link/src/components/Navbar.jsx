import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { countUnreadViews, LEAD_MESSAGES_READ } from '../data/leadStore.js'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const unread = useUnreadViews(user)

  return (
    <nav className="shell flex flex-wrap items-center justify-between gap-fluid-2 py-fluid-2">
      <Link to="/" className="flex items-center gap-3 no-underline">
        <img src="/assets/logo.png" alt="" className="h-9 w-9 object-contain" />
        <span className="text-xl font-bold text-accent">Local Link</span>
      </Link>

      <div className="flex flex-wrap items-center gap-fluid-2">
        <NavLink to="/marketplace" className="nav-link">
          Online Marketplace
        </NavLink>
        <NavLink to="/topics" className="nav-link">
          Topics
        </NavLink>
        <NavLink to="/contact" className="nav-link">
          Contact
        </NavLink>

        {user?.accountType === 'business' && (
          <>
            <NavLink to="/business" className="nav-link">
              My Business
            </NavLink>
            <NavLink to="/leads" className="nav-link">
              Leads
            </NavLink>
          </>
        )}

        {user?.accountType === 'customer' && (
          <NavLink to="/my-leads" className="nav-link">
            My Leads
            {unread > 0 && (
              <span
                title={`${unread} ${unread === 1 ? 'business has' : 'businesses have'} viewed your lead`}
                className="ml-2 inline-block bg-coral px-2 text-[12px] font-bold text-white"
              >
                {unread}
              </span>
            )}
          </NavLink>
        )}

        {user ? (
          <>
            <span className="text-fluid-0 text-ink/60">{user.name}</span>
            <button type="button" onClick={signOut} className="nav-link cursor-pointer">
              Log out
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link">
            Login/Signup
          </NavLink>
        )}
      </div>
    </nav>
  )
}

/* How many of a customer's leads have been viewed since they last checked.
 * Re-checked on every page change, and cleared once My Leads marks them read. */
function useUnreadViews(user) {
  const [unread, setUnread] = useState(0)
  const { pathname } = useLocation()
  const customerId = user?.accountType === 'customer' ? user.id : null

  useEffect(() => {
    if (!customerId) {
      setUnread(0)
      return
    }
    let cancelled = false
    countUnreadViews(customerId)
      .then((count) => !cancelled && setUnread(count))
      // The badge is a nice-to-have; a failed check just hides it.
      .catch(() => !cancelled && setUnread(0))
    return () => {
      cancelled = true
    }
  }, [customerId, pathname])

  useEffect(() => {
    const clear = () => setUnread(0)
    window.addEventListener(LEAD_MESSAGES_READ, clear)
    return () => window.removeEventListener(LEAD_MESSAGES_READ, clear)
  }, [])

  return unread
}
