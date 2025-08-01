import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AddCertificate from './pages/AddCertificate'
import CertificateDetails from './pages/CertificateDetails'
import EditCertificate from './pages/EditCertificate'
import ImportCertificates from './pages/ImportCertificates'
import Profile from './pages/Profile'

// Context
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

// Components
import Navbar from './components/Navbar'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

function App() {

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={<Navigate to="/" />} />
              <Route path="/add-certificate" element={
                <ProtectedRoute>
                  <AddCertificate />
                </ProtectedRoute>
              } />
              <Route path="/certificate/:id" element={
                <ProtectedRoute>
                  <CertificateDetails />
                </ProtectedRoute>
              } />
              <Route path="/edit-certificate/:id" element={
                <ProtectedRoute>
                  <EditCertificate />
                </ProtectedRoute>
              } />
              <Route path="/import-certificates" element={
                <ProtectedRoute>
                  <ImportCertificates />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </motion.div>
          
          {/* Trendy Footer */}
          <footer className="py-6 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">© {new Date().getFullYear()} Certify - Your Digital Certificate Wallet 🔐✨</p>
          </footer>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
