const express = require('express');
const { uploadPdf, savePdf, getPdf } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

// Route to upload PDF for a certificate
router.post('/:id', uploadPdf, savePdf);

// Route to get PDF for a certificate
router.get('/:id', getPdf);

module.exports = router;