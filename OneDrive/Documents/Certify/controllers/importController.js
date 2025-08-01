const Certificate = require('../models/Certificate');

/**
 * Controller to handle bulk import of certificates
 */
exports.importCertificates = async (req, res) => {
  try {
    const { certificates } = req.body;
    
    if (!certificates || !Array.isArray(certificates) || certificates.length === 0) {
      return res.status(400).json({ error: 'No valid certificates provided for import' });
    }
    
    // Track results
    const results = {
      total: certificates.length,
      successful: 0,
      failed: 0,
      errors: []
    };
    
    // Process each certificate
    for (const cert of certificates) {
      try {
        // Add user ID to certificate data
        const certData = {
          ...cert,
          user: req.user._id
        };
        
        // Create certificate
        await Certificate.create(certData);
        results.successful++;
      } catch (err) {
        results.failed++;
        results.errors.push({
          certificate: cert.title || 'Unknown',
          error: err.message
        });
      }
    }
    
    res.status(200).json({
      message: `Successfully imported ${results.successful} out of ${results.total} certificates`,
      results
    });
  } catch (err) {
    console.error('Error importing certificates:', err);
    res.status(500).json({ error: 'Failed to import certificates' });
  }
};