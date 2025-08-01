import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { addCertificate, uploadPdf } from '../utils/api';

const AddCertificate = () => {
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    tags: '',
    issueDate: '',
    expiryDate: '',
    certificateUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    
    if (file) {
      if (file.type !== 'application/pdf') {
        setFileError('Only PDF files are allowed');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setFileError('File size must be less than 5MB');
        return;
      }
      
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Process tags from comma-separated string to array
      const processedData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      // First create the certificate
      const response = await addCertificate(processedData);
      const certId = response.data._id;
      
      // If there's a PDF file, upload it
      if (pdfFile) {
        const formData = new FormData();
        formData.append('pdfFile', pdfFile);
        
        await uploadPdf(certId, formData);
      }
      
      // Redirect to home page on success
      navigate('/');
    } catch (err) {
      console.error('Error adding certificate:', err);
      setError(err.response?.data?.error || 'Failed to add certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Add New Certificate</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Add your achievement to your digital certificate wallet
        </p>

        {error && (
          <div className="bg-error/10 text-error text-sm p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="card p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  id="issuer"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="e.g. Amazon Web Services"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. cloud, aws, tech"
                />
              </div>

              <div className="col-span-1">
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="col-span-1">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date (if applicable)
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="certificateUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Certificate URL/Link
                </label>
                <input
                  type="url"
                  id="certificateUrl"
                  name="certificateUrl"
                  value={formData.certificateUrl}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://example.com/your-certificate"
                />
                <p className="text-xs text-gray-500 mt-1">You can provide a URL or upload a PDF file below</p>
              </div>
              
              <div className="col-span-2">
                <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upload PDF Certificate
                </label>
                <input
                  type="file"
                  id="pdfFile"
                  name="pdfFile"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary/10 file:text-primary
                    hover:file:bg-primary/20
                    cursor-pointer"
                />
                {fileError && (
                  <p className="text-error text-xs mt-1">{fileError}</p>
                )}
                {pdfFile && (
                  <p className="text-success text-xs mt-1">File selected: {pdfFile.name}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Certificate'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddCertificate;