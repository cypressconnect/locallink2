import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Marketplace from './pages/Marketplace.jsx'
import ComingSoon from './pages/ComingSoon.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          {/* Built in a later stage of the project. */}
          <Route path="/contact" element={<ComingSoon title="Contact" />} />
          <Route path="/topics" element={<ComingSoon title="Topics" />} />
          <Route path="/lead/:id" element={<ComingSoon title="Send a Lead" />} />
          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  )
}
