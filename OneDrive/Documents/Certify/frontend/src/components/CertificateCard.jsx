import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { deleteCertificate } from '../utils/api';
import { downloadPdf } from '../utils/exportUtils';
import ShareCertificate from './ShareCertificate';

const CertificateCard = ({ certificate, onDelete }) => {
  const navigate = useNavigate();
  const { _id, title, issuer, issueDate, expiryDate, tags, certificateUrl, pdfFile, createdAt } = certificate;
  const [pdfLoading, setPdfLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState('');

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Format short dates for card display
  const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Check if certificate is expired
  const isExpired = expiryDate && new Date(expiryDate) < new Date();

  // Check if certificate expires soon (within 30 days)
  const expiresSoon = expiryDate && !isExpired && (
    new Date(expiryDate) < new Date(new Date().setDate(new Date().getDate() + 30))
  );
    
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
  
  // PDF download function is defined below

  // Random gradient backgrounds for cards
  const gradients = [
    'from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20',
    'from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20',
    'from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20',
    'from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20',
    'from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20',
  ];
  
  // Use certificate ID to pick a consistent gradient
  const gradientIndex = _id.charCodeAt(0) % gradients.length;
  const gradient = gradients[gradientIndex];
  
  // Handle PDF download
  const handleDownloadPdf = async () => {
    if (!pdfFile) return;
    
    try {
      setPdfLoading(true);
      setError('');
      
      const result = await downloadPdf(_id, title);
      
      if (!result.success) {
        setError(result.error || 'Failed to download PDF. Please try again later.');
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF. Please try again later.');
    } finally {
      setPdfLoading(false);
    }
  };

  // Handle delete certificate
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteCertificate(_id);
      setShowDeleteConfirm(false);
      // Call the onDelete callback to refresh the list
      if (onDelete) {
        onDelete(_id);
      }
    } catch (err) {
      console.error('Error deleting certificate:', err);
      setError('Failed to delete certificate. Please try again later.');
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Animation variant
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div 
        variants={item}
        className={`card overflow-hidden bg-gradient-to-br ${gradient} border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 cursor-pointer`}
        onClick={() => navigate(`/certificate/${_id}`)}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg truncate">{title}</h3>
            {isExpired && (
              <span className="px-2 py-1 bg-error/10 text-error text-xs rounded-full">
                Expired 📅
              </span>
            )}
            {expiresSoon && !isExpired && (
              <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">
                Expires Soon ⏳
              </span>
            )}
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{issuer}</p>
          
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div>
              <p className="text-gray-500 dark:text-gray-500">Issued 📆</p>
              <p className="font-medium">{formatShortDate(issueDate)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-500">Expires 🗓️</p>
              <p className="font-medium">{formatShortDate(expiryDate)}</p>
            </div>
          </div>
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  🏷️ {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              {certificateUrl && (
                <a 
                  href={certificateUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  View 🔗
                </a>
              )}
              <a 
                href={`/edit-certificate/${_id}`} 
                className="text-secondary hover:text-secondary/80 text-sm font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Edit ✏️
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareModal(true);
                }}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Share 🔗
              </button>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="text-sm font-medium text-error hover:text-error/80 flex items-center"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Delete Certificate</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </p>
            {error && (
              <div className="bg-error/10 text-error text-sm p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
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
    </>
  );
};

export default CertificateCard;