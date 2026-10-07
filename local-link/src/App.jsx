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

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={<RequireAuth><Marketplace /></RequireAuth>} />
          <Route path="/topics" element={<RequireAuth><Topics /></RequireAuth>} />
          <Route path="/business" element={<BusinessHome />} />
          {/* Built in a later stage of the project. */}
          <Route path="/contact" element={<ComingSoon title="Contact" />} />
          <Route path="/lead/:businessId" element={<ComingSoon title="Send a Lead" />} />
          <Route path="/leads" element={<ComingSoon title="Leads" />} />
          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  )
}
