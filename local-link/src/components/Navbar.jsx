import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

export default function Navbar() {
  const { user, signOut } = useAuth()

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
        <NavLink to="/contact" className="nav-link">
          Contact
        </NavLink>

        {user ? (
          <>
            <span className="text-fluid-0 text-ink/60">
              {user.businessName || user.name}
            </span>
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
