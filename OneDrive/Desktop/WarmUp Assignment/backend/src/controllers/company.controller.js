import CompanyService from "../services/company.service.js";

export const createCompany = async (req, res) => {
  try {
    // Accept either name or company_name
    const company_name = req.body.company_name || req.body.name;
    const { industry, foundedDate, website, social, logoUrl, bannerUrl } = req.body;

    if (!company_name) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: [{ field: "company_name", msg: "company_name is required" }]
      });
    }

    const createdBy = req.user?.uid || null;

    const company = await CompanyService.create({
      company_name,
      industry,
      foundedDate,
      website,
      social,
      logoUrl,
      bannerUrl,
      createdBy
    });

    return res.status(201).json({ success: true, data: company });
  } catch (err) {
    console.error("createCompany error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const listCompanies = async (req, res) => {
  try {
    const { page = 1, q = "" } = req.query;
    const data = await CompanyService.findAll({ page: Number(page), q });
    return res.json({ success: true, data });
  } catch (err) {
    console.error("listCompanies error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
