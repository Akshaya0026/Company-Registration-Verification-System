import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFileUpload, FaFileAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { readFileAsText, parseCSV, parseJSON, validateCertificates } from '../utils/importUtils';
import { importCertificates } from '../utils/api';

const ImportCertificates = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setError('');
    setParsedData([]);
    setValidationResults(null);
    setImportResults(null);
    
    // Check file type
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'csv' && fileExtension !== 'json') {
      setError('Please upload a CSV or JSON file');
      setFile(null);
      setFileType('');
      e.target.value = null;
      return;
    }
    
    setFile(selectedFile);
    setFileType(fileExtension);
    
    try {
      // Read and parse file
      const content = await readFileAsText(selectedFile);
      let parsed = [];
      
      if (fileExtension === 'csv') {
        parsed = parseCSV(content);
      } else if (fileExtension === 'json') {
        parsed = parseJSON(content);
      }
      
      setParsedData(parsed);
      
      // Validate parsed data
      const { validCertificates, errors } = validateCertificates(parsed);
      setValidationResults({ validCertificates, errors });
    } catch (err) {
      console.error('Error processing file:', err);
      setError(`Error processing file: ${err.message}`);
    }
  };

  // Handle import
  const handleImport = async () => {
    if (!validationResults || validationResults.validCertificates.length === 0) {
      setError('No valid certificates to import');
      return;
    }
    
    setImporting(true);
    setError('');
    
    try {
      const response = await importCertificates(validationResults.validCertificates);
      setImportResults(response.data.results);
    } catch (err) {
      console.error('Error importing certificates:', err);
      setError(err.response?.data?.error || 'Failed to import certificates');
    } finally {
      setImporting(false);
    }
  };

  // Reset the import process
  const handleReset = () => {
    setFile(null);
    setFileType('');
    setParsedData([]);
    setValidationResults(null);
    setImportResults(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Import Certificates</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Import multiple certificates from CSV or JSON files
        </p>

        {error && (
          <div className="bg-error/10 text-error text-sm p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload File</h2>
          
          <div className="mb-6">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select CSV or JSON file
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <label
                htmlFor="file"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <FaFileUpload className="mr-2" />
                Choose File
              </label>
              {file && (
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  {file.name}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Supported formats: CSV, JSON
            </p>
          </div>

          {file && validationResults && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2 flex items-center">
                <FaFileAlt className="mr-2" />
                File Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">File Type:</span> {fileType.toUpperCase()}</p>
                  <p><span className="font-medium">Total Records:</span> {parsedData.length}</p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Valid Records:</span>{' '}
                    <span className="text-success">{validationResults.validCertificates.length}</span>
                  </p>
                  <p>
                    <span className="font-medium">Invalid Records:</span>{' '}
                    <span className="text-error">{validationResults.errors.length}</span>
                  </p>
                </div>
              </div>

              {validationResults.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Validation Errors:</h4>
                  <ul className="text-sm text-error bg-error/5 p-3 rounded-lg max-h-40 overflow-y-auto">
                    {validationResults.errors.map((error, index) => (
                      <li key={index} className="mb-1 flex items-start">
                        <FaTimes className="mr-1 mt-1 flex-shrink-0" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {validationResults && validationResults.validCertificates.length > 0 && !importResults && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={importing}
                className="btn btn-primary"
              >
                {importing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Importing...
                  </span>
                ) : 'Import Certificates'}
              </button>
            </div>
          )}

          {importResults && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2 flex items-center text-success">
                <FaCheck className="mr-2" />
                Import Complete
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Total Processed:</span> {importResults.total}</p>
                  <p>
                    <span className="font-medium">Successfully Imported:</span>{' '}
                    <span className="text-success">{importResults.successful}</span>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Failed:</span>{' '}
                    <span className="text-error">{importResults.failed}</span>
                  </p>
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Import Errors:</h4>
                  <ul className="text-sm text-error bg-error/5 p-3 rounded-lg max-h-40 overflow-y-auto">
                    {importResults.errors.map((error, index) => (
                      <li key={index} className="mb-1">
                        <strong>{error.certificate}:</strong> {error.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Import Another File
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-primary"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">File Format Guidelines</h2>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">CSV Format</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your CSV file should have the following columns:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
              <code className="text-xs">
                Title,Issuer,Issue Date,Expiry Date,Tags,Certificate URL,Date Added
              </code>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: Only the Title field is required. Dates should be in YYYY-MM-DD format. Tags should be semicolon-separated.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">JSON Format</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your JSON file should contain an array of certificate objects with the following structure:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto">
              <pre className="text-xs">
{`[
  {
    "title": "Certificate Title",
    "issuer": "Issuing Organization",
    "issueDate": "2023-01-01",
    "expiryDate": "2026-01-01",
    "tags": ["tag1", "tag2"],
    "certificateUrl": "https://example.com/cert"
  }
]`}
              </pre>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: Only the title field is required. Tags can also be a comma-separated string.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImportCertificates;