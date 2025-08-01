import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCertificate, updateCertificate } from '../utils/api';
import { exportPdf } from '../utils/exportUtils';

const EditCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    tags: '',
    issueDate: '',
    expiryDate: '',
    certificateUrl: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasPdf, setHasPdf] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const response = await getCertificate(id);
        
        const cert = response.data;
        setFormData({
          title: cert.title || '',
          issuer: cert.issuer || '',
          tags: cert.tags ? cert.tags.join(', ') : '',
          issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
          expiryDate: cert.expiryDate ? cert.expiryDate.split('T')[0] : '',
          certificateUrl: cert.certificateUrl || ''
        });
        
        // Check if certificate has a PDF file
        if (cert.pdfFile) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Process tags from comma-separated string to array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      const certificateData = {
        ...formData,
        tags: tagsArray
      };
      
      await updateCertificate(id, certificateData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate(`/certificate/${id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update certificate');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const result = await exportPdf(id, formData.title);
      
      if (!result.success) {
        setError(result.error || 'Failed to view PDF file');
        return;
      }
      
      // Open PDF in a new tab
      window.open(result.url, '_blank');
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(result.url);
      }, 1000);
    } catch (err) {
      console.error('Failed to view PDF:', err);
      setError('Failed to view PDF file');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Certificate</h1>
          <Link to={`/certificate/${id}`} className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
            Cancel
          </Link>
        </div>

        {error && (
          <div className="bg-error/10 text-error text-sm p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-success/10 text-success text-sm p-4 rounded-lg mb-6">
            Certificate updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
                placeholder="e.g. AWS Certified Solutions Architect"
              />
            </div>

            <div>
              <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issuer *
              </label>
              <input
                type="text"
                id="issuer"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
                placeholder="e.g. Amazon Web Services"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
              placeholder="e.g. cloud, aws, devops"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
              />
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="certificateUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Certificate URL
            </label>
            <input
              type="url"
              id="certificateUrl"
              name="certificateUrl"
              value={formData.certificateUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
              placeholder="https://example.com/certificate"
            />
          </div>
          
          {hasPdf && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PDF Certificate
              </label>
              <div className="flex items-center">
                <button 
                  type="button"
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
                      Loading PDF...
                    </>
                  ) : (
                    <>
                      View PDF Certificate
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Note: PDF files can only be replaced by uploading a new certificate</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || success}
              className="btn btn-primary flex items-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : 'Update Certificate'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditCertificate;