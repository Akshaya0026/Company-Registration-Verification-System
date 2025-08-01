const express = require('express');
const {
  getCerts, getCert, addCert, updateCert, deleteCert
} = require('../controllers/certController');
const { importCertificates } = require('../controllers/importController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCerts)
  .post(addCert);

// Route for importing certificates
router.post('/import', importCertificates);

router.route('/:id')
  .get(getCert)
  .put(updateCert)
  .delete(deleteCert);

module.exports = router;

