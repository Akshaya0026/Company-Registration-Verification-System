const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Certificate = require('../models/Certificate');

// Configure multer storage
const storage = multer.memoryStorage();

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Initialize upload middleware
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to handle single file upload
exports.uploadPdf = upload.single('pdfFile');

// Controller to save PDF to certificate
exports.savePdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { id } = req.params;
    
    // Find certificate and update with PDF data
    const cert = await Certificate.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { 
        pdfFile: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname
        }
      },
      { new: true }
    );

    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.status(200).json({ 
      message: 'PDF uploaded successfully',
      certificate: {
        _id: cert._id,
        title: cert.title,
        hasPdf: !!cert.pdfFile
      }
    });
  } catch (err) {
    console.error('Error uploading PDF:', err);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
};

// Controller to get PDF file
exports.getPdf = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find certificate
    const cert = await Certificate.findOne({ _id: id, user: req.user._id });
    
    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    if (!cert.pdfFile || !cert.pdfFile.data) {
      return res.status(404).json({ error: 'No PDF file found for this certificate' });
    }
    
    // Set response headers
    res.set('Content-Type', cert.pdfFile.contentType);
    res.set('Content-Disposition', `inline; filename="${cert.pdfFile.filename}"`);
    
    // Send the PDF data
    res.send(cert.pdfFile.data);
  } catch (err) {
    console.error('Error retrieving PDF:', err);
    res.status(500).json({ error: 'Failed to retrieve PDF' });
  }
};