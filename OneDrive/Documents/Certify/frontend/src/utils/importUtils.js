// Utility functions for importing certificate data

/**
 * Parse CSV data into an array of certificate objects
 * @param {string} csvContent - CSV formatted string
 * @returns {Array} Array of certificate objects
 */
export const parseCSV = (csvContent) => {
  if (!csvContent) return [];
  
  // Split the CSV content into lines
  const lines = csvContent.split('\n');
  
  // Extract headers (first line)
  const headers = lines[0].split(',').map(header => {
    // Remove quotes if present
    return header.replace(/^"|"$/g, '').trim();
  });
  
  // Map header names to expected property names
  const headerMap = {
    'Title': 'title',
    'Issuer': 'issuer',
    'Issue Date': 'issueDate',
    'Expiry Date': 'expiryDate',
    'Tags': 'tags',
    'Certificate URL': 'certificateUrl',
    'Date Added': 'createdAt'
  };
  
  // Parse data rows (skip header)
  const certificates = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    // Handle quoted values with commas inside them
    const values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let char of lines[i]) {
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue);
    
    // Create certificate object
    const certificate = {};
    
    headers.forEach((header, index) => {
      const propName = headerMap[header] || header.toLowerCase().replace(/\s+/g, '');
      let value = values[index] || '';
      
      // Remove quotes if present
      value = value.replace(/^"|"$/g, '');
      
      // Handle special fields
      if (propName === 'tags') {
        certificate[propName] = value ? value.split(';').map(tag => tag.trim()) : [];
      } else if (propName === 'issueDate' || propName === 'expiryDate' || propName === 'createdAt') {
        certificate[propName] = value ? new Date(value).toISOString() : null;
      } else {
        certificate[propName] = value;
      }
    });
    
    certificates.push(certificate);
  }
  
  return certificates;
};

/**
 * Parse JSON data into an array of certificate objects
 * @param {string} jsonContent - JSON formatted string
 * @returns {Array} Array of certificate objects
 */
export const parseJSON = (jsonContent) => {
  if (!jsonContent) return [];
  
  try {
    const parsed = JSON.parse(jsonContent);
    
    // Handle both array and object formats
    const certificates = Array.isArray(parsed) ? parsed : [parsed];
    
    // Validate and normalize each certificate
    return certificates.map(cert => ({
      title: cert.title || '',
      issuer: cert.issuer || '',
      issueDate: cert.issueDate || null,
      expiryDate: cert.expiryDate || null,
      tags: Array.isArray(cert.tags) ? cert.tags : 
            (typeof cert.tags === 'string' ? cert.tags.split(',').map(tag => tag.trim()) : []),
      certificateUrl: cert.certificateUrl || '',
      createdAt: cert.createdAt || null
    }));
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return [];
  }
};

/**
 * Read file content as text
 * @param {File} file - File object
 * @returns {Promise<string>} Promise resolving to file content
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

/**
 * Validate imported certificates
 * @param {Array} certificates - Array of certificate objects
 * @returns {Object} Object with valid certificates and errors
 */
export const validateCertificates = (certificates) => {
  const validCertificates = [];
  const errors = [];
  
  certificates.forEach((cert, index) => {
    // Required field validation
    if (!cert.title) {
      errors.push(`Row ${index + 1}: Title is required`);
      return;
    }
    
    // Date validation
    if (cert.issueDate && isNaN(new Date(cert.issueDate).getTime())) {
      errors.push(`Row ${index + 1}: Invalid issue date format`);
    }
    
    if (cert.expiryDate && isNaN(new Date(cert.expiryDate).getTime())) {
      errors.push(`Row ${index + 1}: Invalid expiry date format`);
    }
    
    // URL validation
    if (cert.certificateUrl && !/^https?:\/\/.+/.test(cert.certificateUrl)) {
      errors.push(`Row ${index + 1}: Invalid URL format`);
    }
    
    // Add to valid certificates if no errors
    if (!errors.find(err => err.startsWith(`Row ${index + 1}:`))) {
      validCertificates.push(cert);
    }
  });
  
  return { validCertificates, errors };
};