import { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays, isPast, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

const ExpirationNotifications = ({ certificates }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expiringCertificates, setExpiringCertificates] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  
  // Check for expiring certificates
  useEffect(() => {
    if (!certificates || certificates.length === 0) return;
    
    // Find certificates that are expiring within 30 days or already expired
    const expiring = certificates.filter(cert => {
      if (!cert.expiryDate) return false;
      
      const expiryDate = parseISO(cert.expiryDate);
      const daysToExpiry = differenceInDays(expiryDate, new Date());
      
      // Include if expired or expiring within 30 days
      return isPast(expiryDate) || (daysToExpiry >= 0 && daysToExpiry <= 30);
    });
    
    // Sort by expiry date (closest first)
    expiring.sort((a, b) => {
      const dateA = parseISO(a.expiryDate);
      const dateB = parseISO(b.expiryDate);
      return dateA - dateB;
    });
    
    setExpiringCertificates(expiring);
    setHasNotifications(expiring.length > 0);
  }, [certificates]);
  
  const getStatusText = (expiryDate) => {
    const date = parseISO(expiryDate);
    const daysToExpiry = differenceInDays(date, new Date());
    
    if (isPast(date)) {
      return {
        text: 'Expired',
        class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: <FaExclamationTriangle className="h-4 w-4" />
      };
    } else if (daysToExpiry <= 7) {
      return {
        text: `Expires in ${daysToExpiry} day${daysToExpiry === 1 ? '' : 's'}`,
        class: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        icon: <FaExclamationTriangle className="h-4 w-4" />
      };
    } else {
      return {
        text: `Expires in ${daysToExpiry} days`,
        class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: <FaBell className="h-4 w-4" />
      };
    }
  };
  
  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <FaBell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        {hasNotifications && (
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
        )}
      </button>
      
      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {expiringCertificates.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {expiringCertificates.map(cert => {
                    const status = getStatusText(cert.expiryDate);
                    
                    return (
                      <Link 
                        key={cert._id} 
                        to={`/certificate/${cert._id}`}
                        className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className={`p-2 rounded-full ${status.class}`}>
                              {status.icon}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{cert.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Issued by {cert.issuer}</p>
                            <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}>
                              {status.text}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <p>No expiring certificates</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpirationNotifications;