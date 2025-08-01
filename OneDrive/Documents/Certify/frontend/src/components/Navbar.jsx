import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaUser, FaCog, FaDesktop } from 'react-icons/fa';
import ExpirationNotifications from './ExpirationNotifications';
import { getCertificates } from '../utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, useSystemTheme, setTheme, systemTheme, isSystemTheme } = useTheme();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const themeMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  
  // Fetch certificates for notifications
  useEffect(() => {
    if (!user) return;
    
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const response = await getCertificates();
        setCertificates(response.data);
      } catch (error) {
        console.error('Error fetching certificates for notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, [user]);

  const handleLogout = () => {
    logout();
  };
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setThemeMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Certify</span>
            </Link>
          </motion.div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/add-certificate" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Add Certificate
            </Link>
            
            {/* Theme toggle with dropdown */}
            <div className="relative" ref={themeMenuRef}>
              <button 
                onClick={() => setThemeMenuOpen(!themeMenuOpen)} 
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Theme settings"
              >
                {theme === 'dark' ? <FaMoon className="h-4 w-4" /> : <FaSun className="h-4 w-4" />}
              </button>
              
              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-dark-bg-secondary ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <button
                      onClick={() => {
                        setTheme('light');
                        setThemeMenuOpen(false);
                      }}
                      className={`${theme === 'light' && !isSystemTheme ? 'bg-gray-100 dark:bg-dark-bg-tertiary' : ''} flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary`}
                    >
                      <FaSun className="mr-3 h-4 w-4 text-yellow-500" />
                      Light Mode
                    </button>
                    <button
                      onClick={() => {
                        setTheme('dark');
                        setThemeMenuOpen(false);
                      }}
                      className={`${theme === 'dark' && !isSystemTheme ? 'bg-gray-100 dark:bg-dark-bg-tertiary' : ''} flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary`}
                    >
                      <FaMoon className="mr-3 h-4 w-4 text-indigo-500" />
                      Dark Mode
                    </button>
                    <button
                      onClick={() => {
                        useSystemTheme();
                        setThemeMenuOpen(false);
                      }}
                      className={`${isSystemTheme ? 'bg-gray-100 dark:bg-dark-bg-tertiary' : ''} flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary`}
                    >
                      <FaDesktop className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      System Default
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Notifications */}
            {!loading && certificates.length > 0 && (
              <ExpirationNotifications certificates={certificates} />
            )}
            
            {/* User menu */}
            <div className="relative ml-3" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FaUser className="h-4 w-4" />
                <span className="text-sm font-medium hidden md:block">
                  {user?.name}
                </span>
              </button>
              
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-dark-bg-secondary ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-dark-text-muted truncate">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary"
                    >
                      <FaUser className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      Your Profile
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary text-left"
                    >
                      <svg className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary focus:outline-none"
            >
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
        className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-800 shadow-lg`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/add-certificate"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Add Certificate
          </Link>
          {/* Theme options */}
          <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Theme</p>
            <button 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full mb-1"
              onClick={(e) => {
                e.stopPropagation();
                setTheme('light');
                setIsOpen(false);
              }}
            >
              <FaSun className="h-4 w-4 text-yellow-500" />
              <span>Light Mode</span>
            </button>
            <button 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full mb-1"
              onClick={(e) => {
                e.stopPropagation();
                setTheme('dark');
                setIsOpen(false);
              }}
            >
              <FaMoon className="h-4 w-4 text-indigo-500" />
              <span>Dark Mode</span>
            </button>
            <button 
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
              onClick={(e) => {
                e.stopPropagation();
                useSystemTheme();
                setIsOpen(false);
              }}
            >
              <FaDesktop className="h-4 w-4" />
              <span>System Default</span>
            </button>
          </div>
          
          <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Account</p>
            <div className="mb-2">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </span>
            </div>
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full mb-1"
            >
              <FaUser className="h-4 w-4" />
              <span>Your Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full btn btn-secondary text-xs py-2 mt-2"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;