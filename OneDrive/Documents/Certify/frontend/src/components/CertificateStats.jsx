import { useState, useEffect } from 'react';
import { FaChartPie, FaCertificate, FaCalendarAlt, FaExclamationTriangle, FaTags } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { isPast, parseISO, differenceInDays, format } from 'date-fns';

const CertificateStats = ({ certificates }) => {
  const [stats, setStats] = useState({
    total: 0,
    expired: 0,
    expiringSoon: 0,
    validCertificates: 0,
    mostUsedTags: [],
    recentlyAdded: null,
    oldestCertificate: null
  });

  useEffect(() => {
    if (!certificates || certificates.length === 0) {
      return;
    }

    // Count total certificates
    const total = certificates.length;

    // Count expired certificates
    const expired = certificates.filter(cert => 
      cert.expiryDate && isPast(parseISO(cert.expiryDate))
    ).length;

    // Count certificates expiring in the next 30 days
    const expiringSoon = certificates.filter(cert => {
      if (!cert.expiryDate) return false;
      const expiryDate = parseISO(cert.expiryDate);
      if (isPast(expiryDate)) return false;
      
      const daysToExpiry = differenceInDays(expiryDate, new Date());
      return daysToExpiry <= 30;
    }).length;

    // Count valid certificates
    const validCertificates = total - expired;

    // Find most used tags
    const tagCounts = {};
    certificates.forEach(cert => {
      if (cert.tags && cert.tags.length > 0) {
        cert.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // Sort tags by count and get top 5
    const mostUsedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Find most recently added certificate
    const sortedByCreatedAt = [...certificates].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    const recentlyAdded = sortedByCreatedAt.length > 0 ? sortedByCreatedAt[0] : null;

    // Find oldest certificate by issue date
    const withIssueDates = certificates.filter(cert => cert.issueDate);
    const sortedByIssueDate = [...withIssueDates].sort((a, b) => 
      new Date(a.issueDate) - new Date(b.issueDate)
    );
    const oldestCertificate = sortedByIssueDate.length > 0 ? sortedByIssueDate[0] : null;

    setStats({
      total,
      expired,
      expiringSoon,
      validCertificates,
      mostUsedTags,
      recentlyAdded,
      oldestCertificate
    });
  }, [certificates]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaChartPie className="mr-2" /> Certificate Statistics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Certificates */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 mr-4">
              <FaCertificate className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Certificates</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</h3>
            </div>
          </div>
        </motion.div>

        {/* Valid Certificates */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/10 text-green-500 mr-4">
              <FaCertificate className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Valid Certificates</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.validCertificates}</h3>
            </div>
          </div>
        </motion.div>

        {/* Expired Certificates */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-500/10 text-red-500 mr-4">
              <FaExclamationTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Expired</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.expired}</h3>
            </div>
          </div>
        </motion.div>

        {/* Expiring Soon */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500 mr-4">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Expiring Soon</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.expiringSoon}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Tags */}
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <FaTags className="mr-2" /> Popular Tags
          </h3>
          {stats.mostUsedTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.mostUsedTags.map((tagInfo, index) => (
                <div 
                  key={index} 
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 flex items-center"
                >
                  <span>{tagInfo.tag}</span>
                  <span className="ml-2 bg-gray-300 dark:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs">
                    {tagInfo.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No tags found</p>
          )}
        </div>

        {/* Certificate Timeline */}
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <FaCalendarAlt className="mr-2" /> Certificate Timeline
          </h3>
          <div className="space-y-3">
            {stats.recentlyAdded && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Most Recent:</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{stats.recentlyAdded.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Added on {format(new Date(stats.recentlyAdded.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            )}
            {stats.oldestCertificate && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400">Oldest Certificate:</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{stats.oldestCertificate.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Issued on {format(parseISO(stats.oldestCertificate.issueDate), 'MMM d, yyyy')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateStats;