import express from 'express';
import { registerCompany, uploadLogo, getMyCompany } from '../controllers/companyController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// @route   POST /api/company
// @desc    Register or Update Company
router.post('/', registerCompany);

// @route   GET /api/company/me
// @desc    Get My Company
router.get('/me', getMyCompany);

// @route   POST /api/company/logo
// @desc    Upload Company Logo
router.post('/logo', upload.single('logo'), uploadLogo);

export default router;
