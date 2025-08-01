import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCertificate, deleteCertificate } from '../utils/api';
import { FaArrowLeft, FaEdit, FaTrash, FaShareAlt } from 'react-icons/fa';
import ShareCertificate from '../components/ShareCertificate';
import { downloadPdf } from '../utils/exportUtils';

const CertificateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [hasPdf, setHasPdf] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const response = await getCertificate(id);
        setCertificate(response.data);
        
        // Check if certificate has a PDF file
        if (response.data.pdfFile) {
          setHasPdf(true);
        }
      } catch (err) {
        setError('Failed to load certificate details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [id]);
  
  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const result = await downloadPdf(id, certificate.title);
      
      if (!result.success) {
        setError(result.error || 'Failed to download PDF file');
      }
    } catch (err) {
      console.error('Failed to download PDF:', err);
      setError('Failed to download PDF file');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteCertificate(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete certificate');
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Format relative time
  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays < 30) return `Expires in ${diffDays} days`;
    if (diffDays < 365) return `Expires in ${Math.floor(diffDays / 30)} months`;
    return `Expires in ${Math.floor(diffDays / 365)} years`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-error/10 text-error text-sm p-4 rounded-lg mb-6 inline-block">
          {error}
        </div>
        <div>
          <Link to="/" className="text-primary hover:text-primary/80">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold mb-4">Certificate not found</h3>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const { title, issuer, tags, issueDate, expiryDate, certificateUrl, createdAt } = certificate;
  const isExpired = expiryDate && new Date(expiryDate) < new Date();

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-start mb-6">
          <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
          
          <div className="flex space-x-2">
            <Link to={`/edit-certificate/${id}`} className="btn btn-secondary text-xs py-1 px-3">
              Edit
            </Link>
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="btn bg-error/80 hover:bg-error text-white text-xs py-1 px-3"
            >
              Delete
            </button>
            <button 
                onClick={() => setShowShareModal(true)} 
                className="btn btn-primary flex items-center"
              >
                <FaShareAlt className="mr-2" />
                Share
              </button>
          </div>
        </div>

        <div className="card overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">{issuer}</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Issue Date</h3>
                <p className="font-medium">{formatDate(issueDate)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Expiry Date</h3>
                <div className="flex items-center">
                  <p className="font-medium">{formatDate(expiryDate)}</p>
                  {expiryDate && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${isExpired ? 'bg-error/10 text-error' : 'bg-info/10 text-info'}`}>
                      {getRelativeTime(expiryDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {tags && tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {certificateUrl && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Certificate Link</h3>
                <a 
                  href={certificateUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex items-center"
                >
                  View Certificate
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              </div>
            )}
            
            {hasPdf && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">PDF Certificate</h3>
                <button 
                  onClick={handleDownloadPdf}
                  disabled={pdfLoading}
                  className="text-primary hover:text-primary/80 flex items-center"
                >
                  {pdfLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Downloading PDF...
                    </>
                  ) : (
                    <>
                      Download PDF
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-8">
              Added on {formatDate(createdAt)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Delete Certificate</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="btn bg-error text-white hover:bg-error/90 flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Share Certificate Modal */}
      {showShareModal && (
        <ShareCertificate 
          certificate={certificate}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default CertificateDetails;