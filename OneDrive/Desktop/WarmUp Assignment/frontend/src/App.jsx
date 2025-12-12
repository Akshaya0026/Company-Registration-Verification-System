import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyRegistration from './pages/CompanyRegistration';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company-register" element={<CompanyRegistration />} />
          <Route path="/settings" element={<Settings />} />
          {/* Redirect root to dashboard or login */}
          <Route path="" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
