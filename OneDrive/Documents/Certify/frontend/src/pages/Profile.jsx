import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaDesktop, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { updateProfile, updatePassword } from '../utils/api';

const Profile = () => {
  const { user, login } = useAuth();
  const { theme, toggleTheme, useSystemTheme, setTheme, isSystemTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    
    try {
      // Call the API to update the profile
      const response = await updateProfile({
        name: formData.name,
        email: formData.email
      });
      
      // Update the user in context with the response data
      const { user: updatedUser, token } = response.data;
      
      // Update the user in context and localStorage
      login(updatedUser, token);
      
      setMessage({ 
        type: 'success', 
        text: response.data.message || 'Profile updated successfully!' 
      });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the API to update the password
      const response = await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setMessage({ 
        type: 'success', 
        text: response.data.message || 'Password updated successfully!' 
      });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to update password. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Your Profile
        </h1>
        
        <div className="card p-0 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser className="inline mr-2" />
              Profile Information
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'password' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('password')}
            >
              <FaLock className="inline mr-2" />
              Change Password
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'appearance' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('appearance')}
            >
              <FaSun className="inline mr-2" />
              Appearance
            </button>
          </div>
          
          <div className="p-6">
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${message.type === 'error' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'} text-sm p-3 rounded-lg mb-4`}
              >
                {message.text}
              </motion.div>
            )}
            
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FaUser className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <FaEnvelope className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="your@email.com"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : 'Update Profile'}
                </button>
              </form>
            )}
            
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange}>
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="••••••••"
                    minLength="6"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="••••••••"
                    minLength="6"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Must be at least 6 characters
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex items-center justify-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : 'Change Password'}
                </button>
              </form>
            )}
            
            {activeTab === 'appearance' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Theme Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-500">
                        <FaSun className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-base font-medium">Light Mode</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use a light color theme</p>
                    </div>
                    <button 
                      onClick={() => setTheme('light')}
                      className={`ml-4 ${theme === 'light' && !isSystemTheme ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} px-4 py-2 rounded-md transition-colors`}
                    >
                      {theme === 'light' && !isSystemTheme ? 'Active' : 'Activate'}
                    </button>
                  </div>
                  
                  <div className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-500">
                        <FaMoon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-base font-medium">Dark Mode</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use a dark color theme</p>
                    </div>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`ml-4 ${theme === 'dark' && !isSystemTheme ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} px-4 py-2 rounded-md transition-colors`}
                    >
                      {theme === 'dark' && !isSystemTheme ? 'Active' : 'Activate'}
                    </button>
                  </div>
                  
                  <div className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500">
                        <FaDesktop className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-base font-medium">System Default</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Follow your system's theme setting</p>
                    </div>
                    <button 
                      onClick={() => useSystemTheme()}
                      className={`ml-4 ${isSystemTheme ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} px-4 py-2 rounded-md transition-colors`}
                    >
                      {isSystemTheme ? 'Active' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;