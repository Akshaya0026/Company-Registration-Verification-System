import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getCertificates } from '../utils/api';
import { FaSortAmountDown, FaSortAmountDownAlt } from 'react-icons/fa';
import { FaFileExport, FaFileCsv, FaFileCode, FaFileImport, FaFilePdf } from 'react-icons/fa';
import { exportToCSV, exportToJSON, downloadFile, downloadPdf } from '../utils/exportUtils';

// Components
import CertificateCard from '../components/CertificateCard';
import CertificateStats from '../components/CertificateStats';

const Dashboard = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await getCertificates();
        setCertificates(response.data);
        
        // Extract all unique tags
        const tags = response.data.reduce((acc, cert) => {
          if (cert.tags && cert.tags.length) {
            cert.tags.forEach(tag => {
              if (!acc.includes(tag)) acc.push(tag);
            });
          }
          return acc;
        }, []);
        setAllTags(tags);
      } catch (err) {
        setError('Failed to load certificates');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Handle certificate deletion
  const handleDeleteCertificate = (deletedCertId) => {
    // Update the certificates state by filtering out the deleted certificate
    setCertificates(prevCertificates => 
      prevCertificates.filter(cert => cert._id !== deletedCertId)
    );
    
    // Recalculate tags after deletion
    const remainingCertificates = certificates.filter(cert => cert._id !== deletedCertId);
    const updatedTags = remainingCertificates.reduce((acc, cert) => {
      if (cert.tags && cert.tags.length) {
        cert.tags.forEach(tag => {
          if (!acc.includes(tag)) acc.push(tag);
        });
      }
      return acc;
    }, []);
    setAllTags(updatedTags);
  };

  // Filter certificates based on search term and tag
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = searchTerm === '' || 
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = filterTag === '' || 
      (cert.tags && cert.tags.includes(filterTag));
    
    return matchesSearch && matchesTag;
  });

  // Sort certificates based on sortField and sortDirection
  const sortedCertificates = [...filteredCertificates].sort((a, b) => {
    // Handle different field types
    if (sortField === 'title' || sortField === 'issuer') {
      const valueA = (a[sortField] || '').toLowerCase();
      const valueB = (b[sortField] || '').toLowerCase();
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    } else if (sortField === 'issueDate' || sortField === 'expiryDate' || sortField === 'createdAt') {
      const dateA = a[sortField] ? new Date(a[sortField]) : new Date(0);
      const dateB = b[sortField] ? new Date(b[sortField]) : new Date(0);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });
  
  // Toggle sort direction or change sort field
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Certificates</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and organize all your professional achievements
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          {/* Export dropdown */}
          {certificates.length > 0 && (
            <div className="relative group">
              <button className="btn btn-secondary flex items-center gap-2">
                <FaFileExport />
                Export
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                <button 
                  onClick={() => {
                    const csvContent = exportToCSV(filteredCertificates);
                    downloadFile(csvContent, 'certificates.csv', 'text/csv');
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaFileCsv />
                  Export as CSV
                </button>
                <button 
                  onClick={() => {
                    const jsonContent = exportToJSON(filteredCertificates);
                    downloadFile(jsonContent, 'certificates.json', 'application/json');
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaFileCode />
                  Export as JSON
                </button>
                {filteredCertificates.some(cert => cert.pdfFile) && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                    <p className="px-4 py-1 text-xs text-gray-500 dark:text-gray-400">PDF Options</p>
                    <button 
                      onClick={() => {
                        // Find certificates with PDFs
                        const certsWithPdf = filteredCertificates.filter(cert => cert.pdfFile);
                        if (certsWithPdf.length === 0) return;
                        
                        // If only one certificate has PDF, download it directly
                        if (certsWithPdf.length === 1) {
                          downloadPdf(certsWithPdf[0]._id, certsWithPdf[0].title);
                          return;
                        }
                        
                        // If multiple certificates have PDFs, alert the user
                        alert(`${certsWithPdf.length} certificates have PDFs. Please open each certificate to download its PDF.`);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FaFilePdf />
                      Export PDFs
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <Link to="/import-certificates" className="btn btn-secondary flex items-center gap-2">
            <FaFileImport />
            Import
          </Link>
          <Link to="/add-certificate" className="btn btn-primary">
            Add New Certificate
          </Link>
        </div>
      </div>

      {/* Search, filter, and sort */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or issuer..."
              className="input"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Tag
            </label>
            <select
              id="tag-filter"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="input"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Sort options */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Sort by:</span>
          
          <button 
            onClick={() => handleSort('title')}
            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${sortField === 'title' ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Title
            {sortField === 'title' && (sortDirection === 'asc' ? <FaSortAmountDown size={12} /> : <FaSortAmountDownAlt size={12} />)}
          </button>
          
          <button 
            onClick={() => handleSort('issuer')}
            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${sortField === 'issuer' ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Issuer
            {sortField === 'issuer' && (sortDirection === 'asc' ? <FaSortAmountDown size={12} /> : <FaSortAmountDownAlt size={12} />)}
          </button>
          
          <button 
            onClick={() => handleSort('issueDate')}
            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${sortField === 'issueDate' ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Issue Date
            {sortField === 'issueDate' && (sortDirection === 'asc' ? <FaSortAmountDown size={12} /> : <FaSortAmountDownAlt size={12} />)}
          </button>
          
          <button 
            onClick={() => handleSort('expiryDate')}
            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${sortField === 'expiryDate' ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Expiry Date
            {sortField === 'expiryDate' && (sortDirection === 'asc' ? <FaSortAmountDown size={12} /> : <FaSortAmountDownAlt size={12} />)}
          </button>
          
          <button 
            onClick={() => handleSort('createdAt')}
            className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${sortField === 'createdAt' ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Date Added
            {sortField === 'createdAt' && (sortDirection === 'asc' ? <FaSortAmountDown size={12} /> : <FaSortAmountDownAlt size={12} />)}
          </button>
        </div>
      </div>

      {/* Certificate Statistics */}
      {!loading && certificates.length > 0 && (
        <CertificateStats certificates={certificates} />
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-error/10 text-error text-sm p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">No certificates found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterTag ? 'Try adjusting your filters' : 'Add your first certificate to get started'}
              </p>
              {!searchTerm && !filterTag && (
                <Link to="/add-certificate" className="btn btn-primary">
                  Add Certificate
                </Link>
              )}
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {sortedCertificates.map(certificate => (
                <CertificateCard 
                  key={certificate._id} 
                  certificate={certificate} 
                  onDelete={handleDeleteCertificate}
                />
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;