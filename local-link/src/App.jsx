import { Routes, Route } from 'react-router-dom'
import { AuthProvider, RequireAuth } from './auth.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Marketplace from './pages/Marketplace.jsx'
import Topics from './pages/Topics.jsx'
import BusinessHome from './pages/BusinessHome.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import SendLead from './pages/SendLead.jsx'
import Leads from './pages/Leads.jsx'
import MyLeads from './pages/MyLeads.jsx'
import { isConfigured } from './supabase.js'

export default function App() {
  if (!isConfigured) {
    return (
      <ComingSoon
        title="Supabase is not set up"
        text="Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to local-link/.env.local, then restart npm run dev."
      />
    )
  }

  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={<RequireAuth><Marketplace /></RequireAuth>} />
          <Route path="/topics" element={<RequireAuth><Topics /></RequireAuth>} />
          <Route path="/business" element={<RequireAuth><BusinessHome /></RequireAuth>} />
          <Route path="/lead/:businessId" element={<RequireAuth><SendLead /></RequireAuth>} />
          <Route path="/leads" element={<RequireAuth><Leads /></RequireAuth>} />
          <Route path="/my-leads" element={<RequireAuth><MyLeads /></RequireAuth>} />
          {/* Built in a later stage of the project. */}
          <Route path="/contact" element={<ComingSoon title="Contact" />} />
          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  )
}
