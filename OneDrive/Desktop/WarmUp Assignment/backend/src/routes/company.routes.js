const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company.controller");
const { verifyFirebaseToken } = require("../middleware/auth.middleware");

router.post("/", verifyFirebaseToken, companyController.createCompany);
router.get("/", companyController.listCompanies);

module.exports = router;
