import { createContext, useState, useEffect, useContext } from 'react';

// Create context
const ThemeContext = createContext();

// Create provider component
export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference in localStorage or prefers dark mode
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    
    // If user has a saved preference, use that
    if (savedTheme) {
      return savedTheme;
    }
    
    // Otherwise, check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light mode
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [systemTheme, setSystemTheme] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  // Apply theme to document when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
      
      // If user is using system theme, update the theme
      if (localStorage.getItem('themeSource') === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    localStorage.setItem('themeSource', 'manual');
  };
  
  // Set theme to system preference
  const useSystemTheme = () => {
    setTheme(systemTheme);
    localStorage.setItem('themeSource', 'system');
  };
  
  // Set theme explicitly
  const setThemeExplicitly = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('themeSource', 'manual');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      systemTheme, 
      toggleTheme, 
      useSystemTheme, 
      setTheme: setThemeExplicitly,
      isSystemTheme: localStorage.getItem('themeSource') === 'system'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;