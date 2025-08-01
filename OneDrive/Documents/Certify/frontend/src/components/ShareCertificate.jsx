import { useState, useEffect } from 'react';
import { FaShareAlt, FaLink, FaEnvelope, FaTwitter, FaLinkedin, FaWhatsapp, FaTimes, FaFilePdf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { exportPdf, downloadPdf } from '../utils/exportUtils';

const ShareCertificate = ({ certificate, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  // Show LinkedIn sharing options
  const [showLinkedInOptions, setShowLinkedInOptions] = useState(false);
  
  // Generate a shareable URL when the modal opens
  useEffect(() => {
    // In a real implementation, this would be a proper sharing URL
    // For now, we'll just create a mock URL with the certificate ID
    const baseUrl = window.location.origin;
    setShareUrl(`${baseUrl}/certificate/${certificate._id}`);
  }, [certificate]);
  
  // Handle click outside to close LinkedIn options dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLinkedInOptions && !event.target.closest('.linkedin-dropdown')) {
        setShowLinkedInOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLinkedInOptions]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out my ${certificate.title} certificate`);
    const body = encodeURIComponent(`I wanted to share my ${certificate.title} certificate from ${certificate.issuer} with you. \n\nView it here: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  
  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Check out my ${certificate.title} certificate from ${certificate.issuer}!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`);
  };
  
  const shareViaLinkedIn = () => {
    // Format the certificate details for LinkedIn
    const title = encodeURIComponent(`${certificate.title} Certificate from ${certificate.issuer}`);
    
    // Create a more comprehensive summary with all available certificate details
    let summaryText = `I'd like to share my ${certificate.title} certificate from ${certificate.issuer}.`;
    
    // Add issue date if available
    if (certificate.issueDate) {
      summaryText += ` This certificate was issued on ${new Date(certificate.issueDate).toLocaleDateString()}`;
    }
    
    // Add expiry information
    if (certificate.expiryDate) {
      summaryText += ` and expires on ${new Date(certificate.expiryDate).toLocaleDateString()}`;
    } else {
      summaryText += ` and does not expire`;
    }
    
    // Add tags if available
    if (certificate.tags && certificate.tags.length > 0) {
      summaryText += `\n\nSkills/Topics: ${certificate.tags.join(', ')}`;
    }
    
    // Add certificate URL if available
    if (certificate.certificateUrl) {
      summaryText += `\n\nVerify this certificate at: ${certificate.certificateUrl}`;
    }
    
    // Note: The description field is not in the current model schema
    // but we'll keep this check in case it's added in the future
    if (certificate.description) {
      summaryText += `\n\n${certificate.description}`;
    }
    
    // Add a call to action
    summaryText += `\n\nView my certificate at: ${shareUrl}`;
    
    const summary = encodeURIComponent(summaryText);
    
    // LinkedIn sharing URL structure for article sharing
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${title}&summary=${summary}`);
  };
  
  // Share as a document on LinkedIn
  const shareAsDocumentOnLinkedIn = async () => {
    if (!certificate.pdfFile) {
      setPdfError('This certificate does not have a PDF file to share as a document');
      setTimeout(() => setPdfError(''), 3000);
      return;
    }
    
    try {
      setPdfLoading(true);
      setPdfError('');
      
      // Export the PDF
      const result = await exportPdf(certificate._id, certificate.title);
      
      if (!result.success) {
        setPdfError(result.error || 'Failed to prepare PDF for sharing');
        return;
      }
      
      // Create a document title for LinkedIn
      const documentTitle = `${certificate.title} Certificate - ${certificate.issuer}`;
      
      // LinkedIn doesn't have a direct API for document uploads via client-side JavaScript
      // We'll open LinkedIn's document upload page and provide instructions
      alert(`To share as a document on LinkedIn:\n\n1. Save the PDF that will download now\n2. Go to LinkedIn and click 'Start a post'\n3. Click the 'Document' icon\n4. Upload the saved PDF\n5. Use this title: "${documentTitle}"\n\nThe PDF will download now.`);
      
      // Download the PDF for the user to upload manually
      await downloadPdf(certificate._id, certificate.title);
      
    } catch (err) {
      console.error('Error preparing LinkedIn document:', err);
      setPdfError('Failed to prepare document for LinkedIn. Please try again later.');
    } finally {
      setPdfLoading(false);
    }
  };
  
  // Handle PDF export and sharing
  const handleExportPdf = async () => {
    if (!certificate.pdfFile) {
      setPdfError('This certificate does not have a PDF file');
      setTimeout(() => setPdfError(''), 3000);
      return;
    }
    
    try {
      setPdfLoading(true);
      setPdfError('');
      
      const result = await downloadPdf(certificate._id, certificate.title);
      
      if (!result.success) {
        setPdfError(result.error || 'Failed to export PDF');
      }
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setPdfError('Failed to export PDF. Please try again later.');
    } finally {
      setPdfLoading(false);
    }
  };
  
  // This function has been removed as we're enhancing the regular LinkedIn sharing instead
  
  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Check out my ${certificate.title} certificate from ${certificate.issuer}: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Certificate</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-2">Share your "{certificate.title}" certificate from {certificate.issuer}</p>
          
          <div className="flex items-center mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
            <input 
              type="text" 
              value={shareUrl} 
              readOnly 
              className="flex-grow bg-transparent border-none focus:ring-0 text-sm text-gray-700 dark:text-gray-300"
            />
            <button 
              onClick={handleCopyLink}
              className={`ml-2 px-3 py-1 rounded-md text-xs font-medium ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        {pdfError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {pdfError}
          </div>
        )}
        
        {certificate.pdfFile && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PDF Options</h4>
            <div className="flex space-x-2">
              <button
                onClick={handleExportPdf}
                disabled={pdfLoading}
                className="flex items-center px-3 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
              >
                {pdfLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaFilePdf className="mr-2" />
                    Export PDF
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Share via</h4>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <button 
            onClick={shareViaEmail}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaEnvelope className="w-6 h-6 text-gray-700 dark:text-gray-300 mb-2" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Email</span>
          </button>
          
          <button 
            onClick={shareViaTwitter}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaTwitter className="w-6 h-6 text-gray-700 dark:text-gray-300 mb-2" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Twitter</span>
          </button>
          
          <div className="relative linkedin-dropdown">
            <button 
              onClick={() => setShowLinkedInOptions(!showLinkedInOptions)}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FaLinkedin className="w-6 h-6 text-gray-700 dark:text-gray-300 mb-2" />
              <span className="text-xs text-gray-700 dark:text-gray-300">LinkedIn</span>
            </button>
            
            {showLinkedInOptions && (
              <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 left-0 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowLinkedInOptions(false);
                    shareViaLinkedIn();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Share as Post
                </button>
                
                {certificate.pdfFile && (
                  <button
                    onClick={() => {
                      setShowLinkedInOptions(false);
                      shareAsDocumentOnLinkedIn();
                    }}
                    disabled={pdfLoading}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    {pdfLoading ? 'Processing...' : 'Share as Document'}
                  </button>
                )}
              </div>
            )}
          </div>
          
          <button 
            onClick={shareViaWhatsApp}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaWhatsapp className="w-6 h-6 text-gray-700 dark:text-gray-300 mb-2" />
            <span className="text-xs text-gray-700 dark:text-gray-300">WhatsApp</span>
          </button>
        </div>
        

      </motion.div>
    </div>
  );
};

export default ShareCertificate;