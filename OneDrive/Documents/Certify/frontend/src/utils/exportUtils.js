// Utility functions for exporting certificate data
import { getPdf } from './api';

/**
 * Convert certificates data to CSV format
 * @param {Array} certificates - Array of certificate objects
 * @returns {string} CSV formatted string
 */
export const exportToCSV = (certificates) => {
  if (!certificates || !certificates.length) return '';
  
  // Define CSV headers
  const headers = [
    'Title',
    'Issuer',
    'Issue Date',
    'Expiry Date',
    'Tags',
    'Certificate URL',
    'Date Added'
  ];
  
  // Format date for CSV
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };
  
  // Create CSV content
  const csvContent = [
    // Add headers
    headers.join(','),
    
    // Add data rows
    ...certificates.map(cert => {
      const row = [
        // Escape quotes in title and wrap in quotes
        `"${(cert.title || '').replace(/"/g, '""')}"`,
        `"${(cert.issuer || '').replace(/"/g, '""')}"`,
        formatDate(cert.issueDate),
        formatDate(cert.expiryDate),
        `"${(cert.tags || []).join('; ')}"`,
        `"${cert.certificateUrl || ''}"`,
        formatDate(cert.createdAt)
      ];
      return row.join(',');
    })
  ].join('\n');
  
  return csvContent;
};

/**
 * Export certificates data to JSON format
 * @param {Array} certificates - Array of certificate objects
 * @returns {string} JSON formatted string
 */
export const exportToJSON = (certificates) => {
  if (!certificates || !certificates.length) return '{}';
  
  // Create a simplified version of the certificates data
  const simplifiedData = certificates.map(cert => ({
    title: cert.title || '',
    issuer: cert.issuer || '',
    issueDate: cert.issueDate || null,
    expiryDate: cert.expiryDate || null,
    tags: cert.tags || [],
    certificateUrl: cert.certificateUrl || '',
    createdAt: cert.createdAt || null
  }));
  
  return JSON.stringify(simplifiedData, null, 2);
};

/**
 * Trigger file download in the browser
 * @param {string} content - File content
 * @param {string} fileName - Name of the file to download
 * @param {string} contentType - MIME type of the file
 */
export const downloadFile = (content, fileName, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  
  // Trigger download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export certificate PDF
 * @param {string} certificateId - ID of the certificate
 * @param {string} title - Title of the certificate for the filename
 * @returns {Promise<{success: boolean, url?: string, error?: string}>} - Result object
 */
export const exportPdf = async (certificateId, title) => {
  try {
    const response = await getPdf(certificateId);
    
    // Create a blob from the PDF data
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    return {
      success: true,
      url,
      blob
    };
  } catch (err) {
    console.error('Error exporting PDF:', err);
    return {
      success: false,
      error: 'Failed to export PDF. Please try again later.'
    };
  }
};

/**
 * Download certificate PDF
 * @param {string} certificateId - ID of the certificate
 * @param {string} title - Title of the certificate for the filename
 * @returns {Promise<{success: boolean, error?: string}>} - Result object
 */
export const downloadPdf = async (certificateId, title) => {
  try {
    const result = await exportPdf(certificateId, title);
    
    if (!result.success) {
      return result;
    }
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = result.url;
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_certificate.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode.removeChild(link);
    URL.revokeObjectURL(result.url);
    
    return { success: true };
  } catch (err) {
    console.error('Error downloading PDF:', err);
    return {
      success: false,
      error: 'Failed to download PDF. Please try again later.'
    };
  }
};